# frozen_string_literal: true

require "rails_helper"

describe ChatMessagesController do
  let(:user) { create(:user) }
  let(:video) { create(:video) }
  let(:chat_message_params) {
    {
      chat_message: {
        body: Faker::Lorem.characters(number: 10),
        video_id: video.id,
      },
    }
  }

  describe "create with authentication" do
    before do
      sign_in(user)
    end

    it "should create message for signed in user" do
      post :create, params: chat_message_params

      expect(response).to have_http_status(200)
      expect(user.chat_messages).not_to(be_empty)
    end

    it "should not create message as body is not present" do
      post :create, params: {chat_message: {video_id: video.id}}

      body = JSON.parse(response.body)
      expect(response).to have_http_status(200)
      expect(body["error_messages"]).not_to(be_empty)
    end
  end

  describe "create without authentication" do
    it "should not allow to create message" do
      post :create, params: chat_message_params
      expect(response).to have_http_status(302)
    end
  end
end
