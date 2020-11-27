# frozen_string_literal: true

class SendConfirmationTextJob < ApplicationJob
  queue_as :default

  def perform(session_token)
    SmsMessage.create_confirmation!(session_token) if session_token.new?
  end
end
