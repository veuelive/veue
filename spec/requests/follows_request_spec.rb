# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Follows", type: :request do
  let(:streamer) { create(:streamer) }
  let(:follower) { create(:user) }
  let(:video) { create(:video, user: streamer) }

  describe "an anonymous user" do
    it "should hault authentication for create request" do
      post video_follow_path(video_id: video.to_param)
      expect(response).to have_http_status(401)
    end

    it "should hault authentication for destroy request" do
      delete video_follow_path(video_id: video.to_param)
      expect(response).to have_http_status(401)
    end
  end

  describe "user is logged in" do
    before do
      login_as follower
    end

    it "should create a follower for video streamer" do
      post video_follow_path(video_id: video.to_param)
      expect(streamer.streamer_follows.count).to eq(1)
    end

    it "should soft remove follwer for video streamer" do
      Follow.create!(streamer_follow: streamer, user_follow: follower)
      delete video_follow_path(video_id: video.to_param)
      expect(streamer.streamer_follows.count).to eq(0)
    end
  end
end
