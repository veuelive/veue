# frozen_string_literal: true

require "rails_helper"

describe "ChatMessages", type: :request do
  let(:user) { create(:user) }
  let(:video) { create(:video) }
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
      post video_chat_messages_path(video), params: chat_message_params

      expect(response).to have_http_status(200)
      expect(user.chat_messages).not_to(be_empty)
    end

    it "should not create message as 'body' is not present" do
      post video_chat_messages_path(video), params: {video_id: video.to_param}

      body = JSON.parse(response.body)
      expect(response).to have_http_status(200)
      expect(body["error_messages"][0]).to match("message")
    end
  end

  describe "create & broadcast" do
    before do
      login_as(user)
      @action_cable = ActionCable.server
    end

    it "should broadcast message on channel" do
      expect { post video_chat_messages_path(video), params: chat_message_params }.to(
        have_broadcasted_to("live_video_#{video.to_param}").with(
          payload: {
            message: chat_message_params[:message],
            user_id: user.to_param,
            name: user.display_name,
          },
          timecode_ms: 0,
        ),
      )
    end
  end

  describe "create without authentication" do
    it "should not allow to create message" do
      post video_chat_messages_path(video), params: chat_message_params
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
