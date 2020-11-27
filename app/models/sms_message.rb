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
    response = call_twillio!

    self.status = response.status

    if response.error_code
      failure!(response.error_code, response.error_message)
    else
      success!(session_token)
    end
  rescue Twilio::REST::TwilioError => e
    failure!(e.code, e.message)
  end

  def success!(session_token)
    session_token.sent_code!
  end

  def failure!(error_code, error_message)
    Rails.logger.error(
      "Unable to send SMS for token #{session_token.id} with Twilio error code #{error_code}: #{error_message}",
    )
    session_token.send_failed!
  end

  def call_twillio!
    if Rails.env.development?
      OpenStruct.new
    else
      client = Twilio::REST::Client.new
      # Unfortunately, we must use "__send__" here because
      # RuboCop will not consider that maybe this is NOT an ActiveRecord
      # model and so will always try and change `#create` to `#create!` unless
      # we do this. THANKS A LOT, RUBOCOP.
      client.messages
            .__send__(:create,
                      body: text,
                      to: to,
                      from: from)
    end
  end
end
