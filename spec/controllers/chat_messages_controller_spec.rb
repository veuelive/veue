# frozen_string_literal: true

require "rails_helper"

describe ChatMessagesController, type: :controller do
  let(:user) { create(:user) }
  let(:video) { create(:video) }
  let(:chat_message_params) {
    {
      body: Faker::Lorem.characters(number: 10),
      video_id: video.to_param, # this actually comes from the URL
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
      post :create, params: {video_id: video.to_param}

      body = JSON.parse(response.body)
      expect(response).to have_http_status(200)
      expect(body["error_messages"][0]).to eq("Body can't be blank")
    end
  end

  describe "create & broadcast" do
    before do
      sign_in(user)
      @action_cable = ActionCable.server
    end

    it "should broadcast message on channel" do
      expect { post :create, params: chat_message_params }.to(
        have_broadcasted_to("live_video_#{video.to_param}").with(
          text: chat_message_params[:body],
          user_id: user.id,
          user_name: user.username.capitalize,
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
