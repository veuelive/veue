# frozen_string_literal: true

class Follow < ApplicationRecord
  belongs_to :user
  belongs_to :channel, counter_cache: :followers_count

  validates :user_id, uniqueness: {scope: %i[channel_id unfollowed_at]}

  before_create(
    :send_consent_information,
    unless: -> { user.instructions_sent? || user.unsubscribed? },
  )
  validate :cannot_follow_self

  def cannot_follow_self
    errors.add(:user_id, "You can't follow yourself") if channel.users.include?(user)
  end

  def unfollow!
    update!(unfollowed_at: Time.current)
  end

  private

  def send_consent_information
    user.send_consent_instructions!(channel)
  end
end
