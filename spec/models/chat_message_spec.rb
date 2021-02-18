# frozen_string_literal: true

require "rails_helper"

describe ChatMessage, type: :model do
  describe "Record creation" do
    it "Should fail if called with an empty message" do
      expect {
        create(:chat_message, input: {message: " " * 6})
      }.to raise_error(ActiveRecord::RecordInvalid)
    end
  end

  describe "Publishing and filtering" do
    it "should publish if it passes" do
      create(:chat_message)
      expect_to_sse_broadcast
    end

    it "should publish if we error" do
      PerspectiveApi.key = "ERROR"
      message = create(:chat_message)
      expect_to_sse_broadcast
      expect(message.video.chat_messages).to be_present
    end
  end
end
