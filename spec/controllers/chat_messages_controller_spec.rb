# frozen_string_literal: true

require "rails_helper"

describe ChatMessagesController, type: :controller do
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

  describe "create with authenticated user" do
    before do
      sign_in(user)
    end

    it "should create message for signed in user" do
      post :create, params: chat_message_params

      expect(response).to have_http_status(200)
      expect(user.chat_messages).not_to(be_empty)
    end

    it "should not create message as 'body' is not present" do
      post :create, params: {chat_message: {video_id: video.id}}

      body = JSON.parse(response.body)
      expect(response).to have_http_status(200)
      expect(body["error_messages"][0]).to eq("Body can't be blank")
    end

    it "should not create message as 'video_id' is not present" do
      post :create, params: {chat_message: {body: Faker::Lorem.characters(number: 10)}}

      body = JSON.parse(response.body)
      expect(response).to have_http_status(200)
      expect(body["error_messages"][0]).to eq("Video must exist")
    end
  end

  describe "create & broadcast" do
    before do
      sign_in(user)
      @action_cable = ActionCable.server
    end

    it "should broadcast message on channel" do
      expect { post :create, params: chat_message_params }.to(
        have_broadcasted_to("live_video_#{video.id}").with(
          text: chat_message_params[:chat_message][:body],
          user_id: user.id,
          user_name: user.username,
          video_id: video.id,
        ),
      )
    end
  end

  describe "create without authentication" do
    it "should not allow to create message" do
      post :create, params: chat_message_params
      expect(response).to redirect_to(new_user_session_path)
    end
  end
end
