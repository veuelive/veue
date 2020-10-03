# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Follow live streamer" do
  let(:streamer) { create(:streamer) }
  let(:follower) { create(:user) }
  let(:video) { create(:video, user: streamer) }

  before :example do
    driven_by(:selenium_chrome_headless)
    visit video_path(video)
  end

  describe "an anonymous user" do
    before(:each) do
    end

    it "doesn't show follow button" do
      expect(has_css?(".follow-btn")).to be(false)
    end
  end

  describe "user logged in" do
    before do
      login_as(follower)
      visit video_path(video)
    end

    it "should create a follow record in db" do
      visit video_path(video)
      find(".follow-btn").click
      page.refresh
      expect(Follow.count).to eq(1)
    end

    it "should update the unfollowed_at time in follow record" do
      follow = Follow.create!(streamer_user_id: streamer.to_param, follower_user_id: follower.to_param)
      visit video_path(video)
      find(".follow-btn").click
      page.refresh
      follow.reload
      expect(follow.unfollowed_at).to_not eq(nil)
    end

    it "should set the unfollowed_at time to nil" do
      follow = Follow.create!(
        streamer_user_id: streamer.to_param,
        follower_user_id: follower.to_param,
        unfollowed_at: Time.current,
      )
      visit video_path(video)
      find(".follow-btn").click
      page.refresh
      follow.reload
      expect(follow.unfollowed_at).to eq(nil)
    end
  end
end
