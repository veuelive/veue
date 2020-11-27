# frozen_string_literal: true

require "rails_helper"

RSpec.describe SmsMessage, type: :model do
  describe ".build_text" do
    it "should generate a message with the code" do
      expect(SmsMessage.build_text(1982)).to match("1982")
    end
  end

  describe ".create_confirmation!" do
    it "should try and message twillio" do
      session_token = create(:session_token)

      perform_enqueued_jobs

      session_token.reload

      # The background process will have actually made it already!

      expect(session_token).to be_pending_confirmation
      sms_message = SmsMessage.last
      expect(sms_message.session_token.id).to eq(session_token.id)
      expect(sms_message.text).to match(session_token.secret_code)
      expect(sms_message.to).to match(session_token.phone_number)
      expect(FakeTwilio.messages.length).to eq(1)
      twilio_message = FakeTwilio.messages.first
      expect(twilio_message[:body]).to eq(sms_message.text)
      expect(twilio_message[:to]).to eq(sms_message.to)
      expect(twilio_message[:from]).to eq(sms_message.from)
    end
  end
end
