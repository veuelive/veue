# frozen_string_literal: true

require "twilio-ruby"

class SmsMessage < ApplicationRecord
  belongs_to :session_token

  before_create :send_message!

  encrypts :to
  blind_index :to
  encrypts :text

  def self.create_confirmation!(session_token)
    SmsMessage.create!(
      session_token: session_token,
      to: session_token.phone_number,
      from: ENV["TWILIO_PHONE_NUMBER"],
      text: SmsMessage.build_text(session_token.secret_code),
      service: "Twilio",
    )
  end

  def self.build_text(secret_code)
    env_prefix =
      if ENV["HEROKU_APP_NAME"] && ENV["HEROKU_APP_NAME"] != "veue-prod"
        "[#{ENV['HEROKU_APP_NAME']}] "
      else
        ""
      end

    "#{env_prefix}Veue Login Code: #{secret_code}"
  end

  def send_message!
    success!(session_token) && return if Rails.env.development?

    response = call_twillio!

    self.status = response.status

    if response.error_code
      Rails.logger.error("Unable to send SMS for token #{session_token.id} with Twilio error code #{response.error_code}")
    else
      success!(session_token)
    end
  end

  def success!(session_token)
    session_token.sent_code!
  end

  def call_twillio!
    client = Twilio::REST::Client.new
    client.messages
          .create(
            body: text,
            to: to,
            from: from,
          )
  end
end
