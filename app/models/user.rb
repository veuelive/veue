# frozen_string_literal: true

class User < ApplicationRecord
  has_many :hosts, dependent: :destroy
  has_many :channels, through: :hosts, dependent: :destroy
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

  has_many :videos, through: :channels, dependent: :destroy
  has_many :video_snapshots, through: :videos, dependent: :destroy

  validates :display_name, length: {maximum: 30, minimum: 1}, presence: true
  validates :phone_number, phone_number: true
  validates :email, email: true
  validates :about_me, length: {maximum: 160}

  has_one_attached :profile_image
  validates :profile_image,
            blob: {
              content_type: %w[image/png image/jpg image/jpeg],
              size_range: 1..5.megabytes,
            }

  after_create :trigger_user_created_events
  after_commit :update_channel_names, on: %i[update]

  # TODO: Remove this in future! Moved to Channel model
  encrypts :mux_stream_key
  encrypts :phone_number
  blind_index :phone_number

  encrypts :email, migrating: true
  # Downcase instead of checking case sensitivity: https://github.com/ankane/blind_index#validations
  blind_index :email, expression: ->(v) { v.presence && v.downcase }, migrating: true

  include PGEnum(sms_status: %w[new_number instructions_sent unsubscribed])
  include PGEnum(user_type: %w[normal employee admin])

  def setup_as_streamer!
    return if streamer?

    channels.create!(name: display_name)
  end

  def streamer?
    channels.any?
  end

  def send_consent_instructions!(channel)
    instructions_sent!
    SendConsentTextJob.perform_later(self, channel)
  end

  def update_channel_names
    channels&.each do |channel|
      channel.update!(name: display_name) if channel.name != display_name
    end
  end

  def follows?(channel)
    subscriptions.include?(channel)
  end

  def trigger_user_created_events
    IfThisThenThatJob.perform_later(
      message: "'#{display_name}' new user registered",
      url: "https://www.veue.tv/users/#{id}",
    )
  end

  def self.find_streamer(url_id)
    User.find(url_id)
  end
end
