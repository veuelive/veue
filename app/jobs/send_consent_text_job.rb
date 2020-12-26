# frozen_string_literal: true

class SendConsentTextJob < ApplicationJob
  queue_as :default

  def perform(follower, channel)
    SmsMessage.follow_consent_message!(
      follower: follower,
      channel: channel,
    )
  end
end
