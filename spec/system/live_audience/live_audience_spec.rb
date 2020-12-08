# frozen_string_literal: true

require "system_helper"
require_relative("../../support/audience_spec_helpers")

describe "Live Audience View" do
  include AudienceSpecHelpers

  let(:user) { create(:user) }
  let(:video) { create(:live_video) }

  before :example do
    resize_window_desktop
  end

  describe "a user is logged in" do
    before :each do
      visit videos_path
      login_as user
      visit video_path(video)
    end

    it "should allow you to follow the streamer" do
      find(".follow-btn").click

      expect(page).to have_content("Unfollow")

      expect(video.user.followers).to include(user)
    end
  end

  describe "an anonymous user" do
    before :each do
      visit video_path(video)
    end

    it "should allow you to login without refreshing" do
      page.evaluate_script("window.not_reloaded = 'not reloaded';")
      expect(page).to have_content("Login")
      new_user = create(:user)
      login_as(new_user)
      expect(page.evaluate_script("window.not_reloaded")).to eq("not reloaded")
      expect(page).to have_content(new_user.display_name)
    end

    it "should update the timecode" do
      assert_video_is_playing
      expect(current_timecode).to be > 0
    end

    it "should mute currently playing video" do
      find(".primary-canvas").hover
      find(".toggle-audio").click
      expect(page.find(".toggle-audio img")["alt"]).to have_content("mute")
    end
  end
end
