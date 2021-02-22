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

      assert_video_is_playing

      expect(is_video_playing?).to eq(true)

      expect(current_timecode).to be > 0
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

      find(".replay-badge").hover
      expect(page).to have_css(".badge-message", visible: true)
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
      expect(page).to have_content(late_message.payload["message"])
    end
  end

  describe "Starting further into the video" do
    it "should show all chat messages" do
      late_message.update!(timecode_ms: 9_999)
      visit path_for_video(video, t: 1)
      expect(page).to have_content(ChatMessage.first.payload["message"])

      expect(page).to have_no_content(late_message.payload["message"])

      # Seeking SHOULD have that message!
      visit path_for_video(video, t: 10)
      # Messages from before stream should show
      first_message = ChatMessage.first
      expect(first_message.timecode_ms).to eq(0)
      expect(page).to have_content(first_message.payload["message"])
      expect(page).to have_content(late_message.payload["message"])
    end

    it "should start the video later if an offset is defined for the video" do
      video.update!(start_offset: 5, duration: 30)

      visit path_for_video(video)

      expect(page).to have_css("[data-start-offset='5']")

      # Use 4 due to possible rounded issues
      expect(current_timecode).to be >= 4
    end

    it "should end the video earlier if an offset is defined" do
      video.update!(end_offset: 5, duration: 30)

      visit path_for_video(video)

      expect(page).to have_css("[data-end-offset='5']")
      expect(is_video_playing?).to be(true)

      # Use 26 to account for possible rounding issues.
      # Use a float because video durations on a video element are floats
      expect(Float(find("#duration-time-display")["data-duration"])).to be <= 26.0
    end
  end
end
