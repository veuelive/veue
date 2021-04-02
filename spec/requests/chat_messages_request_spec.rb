# frozen_string_literal: true

require "rails_helper"

describe "ChatMessages", type: :request do
  let(:user) { create(:user) }
  let(:channel) { video.channel }
  let(:video) { create(:live_video) }
  let(:chat_message_params) {
    {
      message: Faker::Lorem.characters(number: 10),
    }
  }

  describe "create with authenticated user" do
    before do
      get "/"
      login_as(user)
    end

    it "should create message for signed in user" do
      post channel_live_chat_messages_path(channel), params: chat_message_params

      expect(response).to have_http_status(200)
      expect(user.chat_messages.published).not_to(be_empty)
    end

    it "should not create message as 'body' is not present" do
      post channel_live_chat_messages_path(channel), params: {video_id: video.to_param}

      body = JSON.parse(response.body)
      expect(response).to have_http_status(200)
      expect(body["error_messages"][0]).to match("message")
    end

    it "shoud not create message as 'length' exceeds limit" do
      post channel_live_chat_messages_path(channel), params: {message: Faker::Lorem.characters(number: 183)}

      body = JSON.parse(response.body)
      error_message = "Text is too long (maximum is 182 characters)"
      expect(response).to have_http_status(200)
      expect(body["error_messages"][0]).to match(error_message)
    end

    it "should not publish moderation failures" do
      expect(user.chat_messages.published).to(be_empty)
      expect(user.moderation_items).to(be_empty)

      PerspectiveApi.key = "FAIL"
      post channel_live_chat_messages_path(channel), params: chat_message_params

      expect(response).to have_http_status(200)
      expect(user.moderation_items).not_to(be_empty)
      expect(user.chat_messages.unscoped).not_to(be_empty)
      # only one broadcast from the start
      expect_to_sse_broadcast(1)
      expect(video.chat_messages.published).to(be_empty)
    end
  end

  describe "create without authentication" do
    it "should not allow to create message" do
      post(channel_live_chat_messages_path(channel), params: chat_message_params, headers: request_json_header)
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
