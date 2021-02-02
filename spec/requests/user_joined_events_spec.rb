# frozen_string_literal: true

require "rails_helper"

describe Channels::VideosController do
  describe "user joined events" do
    before(:each) do
      @viewer = create(:user)
      login_as @viewer
    end

    describe "for live videos" do
      it "should create a new user joined event" do
        video = create(:live_video)
        expect(video.user_joined_events.size).to eq(0)
        post viewed_channel_video_url(video.channel, video, minute: 1)
        post viewed_channel_video_url(video.channel, video, minute: 1)
        post viewed_channel_video_url(video.channel, video, minute: 1)
        expect(video.user_joined_events.reload.size).to eq(1)
      end
    end

    describe "for vods" do
      it "should not create a new user joined event" do
        video = create(:vod_video)
        expect(video.user_joined_events.size).to eq(0)
        post viewed_channel_video_url(video.channel, video, minute: 1)
        expect(video.user_joined_events.reload.size).to eq(0)
      end
    end
  end
end
