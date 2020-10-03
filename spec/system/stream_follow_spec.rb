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

  describe "user logged in and follow record is not present" do
    before do
      login_as(follower)
      visit video_path(video)
    end

    it "should create a follow record in db" do
      find(".follow-btn").click

      expect(page).to have_content("Following")
    end
  end

  describe "user logged in and follow record present already" do
    before do
      login_as(follower)
      @follow = Follow.create!(
        streamer_user_id: streamer.to_param,
        follower_user_id: follower.to_param,
      )
    end

    it "should update the unfollowed_at time in follow record" do
      visit video_path(video)
      find(".follow-btn").click

      expect(page).to have_content("Follow")
    end

    it "should set the unfollowed_at time to nil" do
      @follow.update!(
        unfollowed_at: Time.current,
      )
      visit video_path(video)
      find(".follow-btn").click

      expect(page).to have_content("Following")
    end
  end
end
