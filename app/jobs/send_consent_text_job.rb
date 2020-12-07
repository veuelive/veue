# frozen_string_literal: true

class SendConsentTextJob < ApplicationJob
  queue_as :default

  def perform(follower, streamer)
    SmsMessage.follow_consent_message!(
      follower: follower,
      streamer: streamer,
    )
  end
end
