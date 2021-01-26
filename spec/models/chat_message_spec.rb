# frozen_string_literal: true

require "rails_helper"

describe ChatMessage do
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

    it "should reject and not publish failures" do
      PerspectiveApi.key = "FAIL"
      message = create(:chat_message)
      expect_to_sse_broadcast(0)

      expect(message.video.chat_messages).to be_empty
    end
  end
end
