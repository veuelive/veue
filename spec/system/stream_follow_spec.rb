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

    it "should make user following the streamer" do
      find(".follow-btn").click

      expect(page).to have_content("Following")
    end

    it "should make user unfollowed streamer" do
      @follow = Follow.create!(
        streamer_id: streamer.to_param,
        follower_id: follower.to_param,
      )
      visit video_path(video)
      find(".follow-btn").click

      expect(page).to have_content("Follow")
    end
  end
end
