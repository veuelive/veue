# frozen_string_literal: true

require "rails_helper"

describe Channels::Live::EventsController do
  describe "fetch video events" do
    let(:user) { create(:user_with_profile) }
    let(:video) { create(:video, user: user) }

    before(:each) do
      login_as user
    end

    it "should fetch chat messages event along with avatar" do
      create(:chat_message, user: user, video: video)

      get channel_live_events_path(video.channel.slug)
      expect(response).to have_http_status(:success)

      data = JSON.parse(response.body)[0]["data"]
      expect(data.keys).to include("avatarAttached")
    end
  end
end
