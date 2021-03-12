# frozen_string_literal: true

require "rails_helper"

describe Channels::Live::EventsController do
  describe "fetch video events" do
    let(:first_user) { create(:user, :with_avatar) }
    let(:video) { create(:video, user: first_user) }

    before(:each) do
      login_as first_user
    end

    it "should fetch chat messages event along with avatar" do
      chat_message = create(:chat_message, user: first_user, video: video)

      get channel_live_events_path(video.channel.slug)
      expect(response).to have_http_status(:success)

      data = JSON.parse(response.body)[0]["data"]
      expect(data.keys).to include("userAvatar")
    end
  end
end
