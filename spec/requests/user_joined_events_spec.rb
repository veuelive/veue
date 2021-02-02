# frozen_string_literal: true

require "rails_helper"

describe Channels::VideosController do
  describe "user joined events" do
    before(:each) do
      @viewer = create(:user)
      login_as @viewer
    end

    describe "for live videos" do
      let(:video) { create(:live_video) }
      it "should create a new user joined event" do
        expect(video.user_joined_events.size).to eq(0)
        post viewed_channel_video_url(video.channel, video, minute: 1)
        post viewed_channel_video_url(video.channel, video, minute: 1)
        post viewed_channel_video_url(video.channel, video, minute: 1)
        expect(video.user_joined_events.reload.size).to eq(1)
      end

      it "should not create a user_joined_event if less than 5 seconds have passed since the previous" do
        expect(Rails.cache).to receive(:fetch).and_return(Integer(3.seconds.ago))
        post viewed_channel_video_url(video.channel, video, minute: 1)
        expect(video.user_joined_events.reload.size).to eq(0)
      end

      it "should create a 2nd_user_joined event if greater than 5 seconds have passed" do
        expect(Rails.cache).to receive(:fetch).and_return(Integer(6.seconds.ago))
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
