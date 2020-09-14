# frozen_string_literal: true

class SendConfirmationTextJob < ApplicationJob
  queue_as :default

  def perform(user_login_attempt)
    user_login_attempt.sent_code!
  end
end
