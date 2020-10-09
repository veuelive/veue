# frozen_string_literal: true

require "rails_helper"
require_relative("../support/audience_spec_helpers")

describe "Live Audience View" do
  include AudienceSpecHelpers

  let(:user) { create(:user) }
  let(:video) { create(:live_video, {hls_url: "/__test/live/playback.m3u8"}) }

  before :example do
    driven_by(:selenium_chrome_headless)
    resize_window_desktop
  end

  describe "a user is logged in" do
    before :each do
      login_as user
      visit video_path(video)
    end

    it "should allow for chat messages to be sent" do
      expect(page).to have_selector(".message-write")
    end
  end

  describe "an anonymous user" do
    before :each do
      visit video_path(video)
    end

    it "should not allow you to chat" do
      expect(page).not_to(have_selector(".message-write"))
    end

    it "should show messages from other users" do
      other_user = create(:user)
      message = "Pizza time!"

      ensure_video_starts_playing

      video.chat_messages.create!(user: other_user, input: {message: message})

      expect(page).to have_content(message)
      expect(page).to have_content(other_user.display_name)

      page.refresh

      ensure_video_starts_playing

      # BUG: VEUE-81
      # We had a bug that was causing the following to break, so we refresh to
      # make sure that a visitor would see the content even if it's not coming
      # through the WS connection
      expect(page).to have_content(message)
      expect(page).to have_content(other_user.display_name)
    end
  end

  describe "live watching" do
    it "should show the timestamp" do
      visit(video_path(video))
      ensure_video_starts_playing
      page.find("*[data-target=\"audience-view.timeDisplay\"]", text: "00:00:01", wait: 5)
    end
  end
end
