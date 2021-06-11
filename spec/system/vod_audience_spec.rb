# frozen_string_literal: true

require "system_helper"
require_relative("../support/audience_spec_helpers")

describe "Prerecorded Audience View" do
  include AudienceSpecHelpers

  let(:user) { create(:user) }
  let(:video) { create(:vod_video) }

  before :each do
    resize_window_desktop
  end

  describe "anonymous user" do
    it "should have a video to play!" do
      visit path_for_video(video)

      assert_video_is_playing(5)

      expect(is_video_playing?).to eq(true)

      expect(current_timecode).to be > 0

      expect_analytics_event("Player", "State Changed", "playing")
    end

    it "does not update view count on refresh" do
      visit path_for_video(video)
      assert_video_is_playing
      # No views because it's US
      expect(page).to have_css(".widget[data-views='0']")

      # Now our view will count...
      # Refresh the page
      visit path_for_video(video)
      expect(page).to have_css(".widget[data-views='1']")

      # Log in should keep the view count the same
      login_as user
      visit path_for_video(video)

      expect(page).to have_css(".widget[data-views='1']")

      logout_user

      # Same browser session!
      login_as create(:user)
      visit path_for_video(video)

      # The fingerprint stopped this from counting as a new viewer
      expect(page).to have_css(".widget[data-views='1']")

      reset_session!

      # New fingerprint!
      visit path_for_video(video)
      assert_video_is_playing
      refresh
      expect(page).to have_css(".widget[data-views='2']")
    end

    it "should have replay badge which show message on mouse hover" do
      visit path_for_video(video)

      expect(page).to have_css(".replay-badge")
    end
  end

  let(:late_message) { create(:chat_message, video: video) }

  describe "Events work properly" do
    it "should show pre-live messages" do
      visit path_for_video(video)

      # Messages from before stream should show
      first_message = video.chat_messages.first
      expect(first_message.timecode_ms).to eq(0)
      expect(page).to have_content(first_message.payload["message"])
    end

    it "should work for post-live messages" do
      late_message.update!(timecode_ms: 1_000)
      # We need to reload to get the event we just added
      visit path_for_video(video)

      # We are starting at 0ms, but the below method will wait long enough to see it appear
      expect(page).to have_content(late_message.payload["message"], wait: 13)
    end
  end

  describe "Starting further into the video" do
    it "should not allow you to set t=? > video duration" do
      visit path_for_video(video, t: 900)
      expect(page).to have_css("[data-start-time='0']")
    end

    it "should show all chat messages" do
      late_message.update!(timecode_ms: 8_999)
      visit path_for_video(video, t: 1)
      assert_video_is_playing(2)
      expect(page).to have_css("[data-start-time='1']")
      expect(page).to have_content(ChatMessage.first.payload["message"])

      expect(page).to have_no_content(late_message.payload["message"], wait: 0)

      # Seeking SHOULD have that message!
      visit path_for_video(video, t: 9)
      assert_video_is_playing(9)

      expect(page).to have_css("[data-start-time='9']")
      # Messages from before stream should show
      first_message = ChatMessage.first
      expect(first_message.timecode_ms).to eq(0)
      expect(page).to have_content(first_message.payload["message"])
      expect(page).to have_content(late_message.payload["message"])
    end

    it "should start the video later if an offset is defined for the video" do
      start_offset = 10
      video.update!(start_offset: start_offset)

      visit path_for_video(video)

      expect(page).to have_css("[data-start-offset='#{start_offset}']")
      expect(page).to have_css("[data-start-time='#{start_offset}']")
      assert_video_is_playing

      # We actually have no clue where in the time code we'll be, but its safe
      # to assume we'll be greater than 0.
      expect(current_timecode).to be >= 10

      # We can override this value by passing ?t=S where S is the number of seconds
      visit path_for_video(video, t: 25)
      # If this is failing, DO NOT make this wait longer, it will break the rest of the test!
      assert_video_is_playing

      # Use 24 in case of any rounding issues, its a safe number that is close
      # enough to 't' and far enough from the start offset
      expect(current_timecode).to be >= 24
    end

    it "should end the video earlier if an offset is defined" do
      end_offset = 50
      video.update!(end_offset: end_offset, duration: 54)

      visit path_for_video(video)
      assert_video_is_playing

      expect(page).to have_css("[data-end-offset='#{end_offset}']")
      expect(is_video_playing?).to be(true)

      ensure_controls_visible

      # Use 26 to account for possible rounding issues.
      # Use a float because video durations on a video element are floats
      expect(Float(find("#duration-time-display")["data-duration"])).to be <= 26.0
    end

    it "should show time in chat message" do
      late_message.update!(timecode_ms: 8_999)
      visit path_for_video(video, t: 9)
      assert_video_is_playing(9)

      # calculate displayed time from timecode_ms
      seconds = late_message.timecode_ms / 1000
      hours = seconds / 3600
      minutes = (hours < 1 ? seconds : seconds % 3600) / 60
      time = ["%02d" % minutes, "%02d" % seconds].join(":")
      time = "'%02d' % #{hours}:#{time}" if hours > 1

      expect(page).to have_content(time)
    end
  end

  describe "Unmute banner" do
    it "Should display when the video is visited and disappear when clicked" do
      visit path_for_video(video)
      expect(find(".mute-banner")).to have_content(I18n.t("video.click_to_unmute"))

      find(".mute-banner").click
      expect(find(".mute-banner", visible: false)).to_not be_visible
    end

    it "Should disappear when the user clicks the player control mute button" do
      visit path_for_video(video)
      expect(page).to have_css(".mute-banner")
      find(".mute-banner", visible: true).click
      expect(find(".mute-banner", visible: false)).to_not be_visible
    end
  end

  describe "Video controls visibility" do
    before(:each) do
      resize_window_to_mobile
    end

    it "should display video controls and overlay when clicked" do
      visit path_for_video(video)
      expect(find(".mute-banner")).to have_content(I18n.t("video.tap_to_unmute"))
      find(".mute-banner").click
      find(".primary-video").click
      expect(page).to have_css("[data-audience--player-controls-video-player-state='unfocused']")
      expect(page).to have_css(".primary-video__overlay", visible: false)

      find(".primary-video").click
      expect(page).to have_css("[data-audience--player-controls-video-player-state='focused']")
      expect(page).to_not have_css(".hide-controls")
      expect(page).to have_css(".primary-video__overlay", visible: true)
    end
  end
end
