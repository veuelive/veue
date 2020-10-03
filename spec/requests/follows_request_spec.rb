# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Follows", type: :request do
  let(:streamer) { create(:streamer) }
  let(:follower) { create(:user) }
  let(:video) { create(:video, user: streamer) }

  describe "an anonymous user" do
    it "should hault authentication for create request" do
      post video_follows_path(video_id: video.to_param)
      expect(response).to have_http_status(401)
    end

    it "should hault authentication for destroy request" do
      follow = Follow.create!(streamer_user_id: streamer.to_param, follower_user_id: follower.to_param)
      delete video_follow_path(video_id: video.to_param, id: follow.to_param)
      expect(response).to have_http_status(401)
    end
  end

  describe "user is logged in and no follow record in database" do
    before do
      login_as follower
    end

    it "should create a follow record in database" do
      post video_follows_path(video_id: video.to_param)
      expect(Follow.count).to eq(1)
    end
  end

  describe "user is logged in and follow record exists in database" do
    before do
      login_as follower
      @follow = Follow.create!(
        streamer_user_id: streamer.to_param,
        follower_user_id: follower.to_param,
      )
    end

    it "should set unfollowed_at value to nil" do
      post video_follows_path(video_id: video.to_param)
      @follow.reload
      expect(@follow.unfollowed_at).to eq(nil)
    end

    it "should set unfollowed_at value to current_time" do
      delete video_follow_path(video_id: video.to_param, id: @follow.to_param)
      @follow.reload
      expect(@follow.unfollowed_at).to_not eq(nil)
    end
  end
end
