# frozen_string_literal: true

require "twilio-ruby"

class SmsMessage < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :session_token, optional: true

  encrypts :to
  blind_index :to
  encrypts :text

  validates :to, presence: true
  validates :text, presence: true

  def self.follow_consent_message!(follower:, channel:)
    SmsMessage.create!(
      to: follower.phone_number,
      from: ENV["TWILIO_PHONE_NUMBER"],
      text: I18n.t("text_messages.follow_consent", display_name: channel.name),
      service: "Twilio",
    ).send_message!
  end

  def self.notify_broadcast_start!(channel:, channel_url:, follower:)
    message = "#{channel.name} is now live on Veue! #{channel_url}"

    SmsMessage.create!(
      to: follower.phone_number,
      from: ENV["TWILIO_PHONE_NUMBER"],
      text: message,
      service: "Twilio",
    ).send_message!
  end

  def self.create_confirmation!(session_token)
    SmsMessage.create!(
      session_token: session_token,
      to: session_token.phone_number,
      from: ENV["TWILIO_PHONE_NUMBER"],
      text: SmsMessage.build_text(session_token.secret_code),
      service: "Twilio",
    ).send_auth_message!

    # Mimics the previous before_create :send_message!
    # sms_message.send_message!
    # sms_message.save!
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

    failure!(response.code, response.message) if response.error_code
  rescue Twilio::REST::TwilioError => e
    failure!(e.code, e.message)
  end

  def send_auth_message!
    response = call_twillio!
    self.status = response.status

    if response.error_code
      auth_failure!(response.code, response.message)
    else
      auth_success!(session_token)
    end
  rescue Twilio::REST::TwilioError => e
    auth_failure!(e.code, e.message)
  end

  def auth_success!(session_token)
    session_token.sent_code!
  end

  def failure!(error_code, error_message)
    Rails.logger.error("Unable to send SMS with Twilio error code #{error_code}: #{error_message}")
  end

  def auth_failure!(error_code, error_message)
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
