# frozen_string_literal: true

class User < ApplicationRecord
  has_many :channels, dependent: :destroy
  has_many :video_events, dependent: :destroy
  has_many :chat_messages, dependent: :destroy
  has_many :session_tokens, dependent: :nullify
  has_many :moderation_items, dependent: :nullify
  has_many :follows,
           -> { where(unfollowed_at: nil) },
           inverse_of: :user,
           dependent: :destroy
  has_many :subscriptions,
           through: :follows,
           source: :channel

  validates :display_name, length: {maximum: 40, minimum: 1}, presence: true
  validates :phone_number, phone_number: true
  validates :email, email: true, uniqueness: {allow_blank: true}

  has_one_attached :profile_image
  validates :profile_image,
            blob: {
              content_type: %w[image/png image/jpg image/jpeg],
              size_range: 1..5.megabytes,
            }

  after_create :trigger_user_created_events

  # TODO: Remove this in future! Moved to Channel model
  encrypts :mux_stream_key
  encrypts :phone_number
  blind_index :phone_number

  encrypts :email, migrating: true
  # Downcase instead of checking case sensitivity: https://github.com/ankane/blind_index#validations
  blind_index :email, expression: ->(v) { v.presence && v.downcase }, migrating: true

  include PGEnum(sms_status: %w[new_number instructions_sent unsubscribed])

  def setup_as_streamer!
    return if channels.any?

    channels.create!(name: display_name)
  end

  def send_consent_instructions!(channel)
    instructions_sent!
    SendConsentTextJob.perform_later(self, channel)
  end

  def follows?(channel)
    subscriptions.include?(channel)
  end

  def trigger_user_created_events
    IfThisThenThatJob.perform_later(
      message: "'#{display_name}' new user registered",
      url: "https://www.veuelive.com/users/#{id}",
    )
  end

  def self.find_streamer(url_id)
    User.find(url_id)
  end
end
