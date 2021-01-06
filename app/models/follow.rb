# frozen_string_literal: true

class Follow < ApplicationRecord
  belongs_to :user
  belongs_to :channel

  validates :user_id, uniqueness: {scope: %i[channel_id unfollowed_at]}

  before_create(
    :send_consent_information,
    unless: -> { user.instructions_sent? || user.unsubscribed? },
  )

  def unfollow!
    update!(unfollowed_at: Time.current)
  end

  private

  def send_consent_information
    user.send_consent_instructions!(channel)
  end
end
