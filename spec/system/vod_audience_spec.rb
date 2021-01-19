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
      expect(page).to have_css(".widget[data-views='1']")

      # Refresh the page
      visit path_for_video(video)
      expect(page).to have_css(".widget[data-views='1']")

      # Log in should keep the view count the same
      login_as user
      visit path_for_video(video)

      expect(page).to have_css(".widget[data-views='1']")

      logout_user

      login_as create(:user)
      visit path_for_video(video)

      expect(page).to have_css(".widget[data-views='2']")

      # Log out and refresh page
      logout_user

      # Because the last "anonymous" session got associated with the second
      # user, we are willing to take a new "anonymous" view from this UA+IP
      visit path_for_video(video)
      expect(page).to have_css(".widget[data-views='3']")
    end

    it "should have replay badge which show message on mouse hover" do
      visit path_for_video(video)

      expect(page).to have_css(".replay-badge")

      find(".replay-badge").hover
      expect(page).to have_css(".badge-message", visible: true)
    end
  end

  describe "Video Controls" do
    before :each do
      visit path_for_video(video)
    end

    describe "Desktop video controls" do
      it "should play / pause on button click" do
        find(".primary-video-area").hover

        play_class = ".toggle-play.desktop"

        # Only the desktop buttons should be visible on desktop
        expect(page).to have_css(play_class, visible: true)
        expect(page).to have_css(".toggle-play.mobile", visible: false)

        # Video should be autoplaying
        expect(is_video_playing?).to be(true)
        expect(is_video_paused?).to be(false)

        # Pauses video
        find(play_class).click

        expect(is_video_playing?).to be(false)
        expect(is_video_paused?).to be(true)

        # Plays video
        find(play_class).click

        expect(is_video_playing?).to be(true)
        expect(is_video_paused?).to be(false)
      end

      it "should mute / unmute on button click" do
        find(".primary-video-area").hover

        audio_class = ".toggle-audio.desktop"

        # Only the desktop buttons should be visible on desktop
        expect(page).to have_css(audio_class, visible: true)
        expect(page).to have_css(".toggle-play.mobile", visible: false)

        # Video should be automuted
        expect(is_video_muted?).to be(true)
        expect(is_video_unmuted?).to be(false)

        # Pauses video
        find(audio_class).click

        expect(is_video_muted?).to be(false)
        expect(is_video_unmuted?).to be(true)

        # Plays video
        find(audio_class).click

        expect(is_video_muted?).to be(true)
        expect(is_video_unmuted?).to be(false)
      end
    end

    describe "Mobile video controls" do
      before :example do
        resize_window_to_mobile
      end

      it "should play / pause video on mobile" do
        # Hover doesnt exist on mobile
        find(".primary-video-area").click
        play_class = ".toggle-play.mobile"

        # Only the mobile buttons should be visible on mobile
        expect(page).to have_css(play_class, visible: true)
        expect(page).to have_css(".toggle-play.desktop", visible: false)

        # Video should be autoplaying
        expect(is_video_playing?).to be(true)
        expect(is_video_paused?).to be(false)

        # Pauses video
        find(play_class).click

        expect(is_video_playing?).to be(false)
        expect(is_video_paused?).to be(true)

        # Plays video
        find(play_class).click

        expect(is_video_playing?).to be(true)
        expect(is_video_paused?).to be(false)
      end

      it "should mute / umuted on button click" do
        find(".primary-video-area").hover

        audio_class = ".toggle-audio.mobile"

        # Only the mobile buttons should be visible on mobile
        expect(page).to have_css(audio_class, visible: true)
        expect(page).to have_css(".toggle-play.desktop", visible: false)

        # Video should be automuted
        expect(is_video_muted?).to be(true)
        expect(is_video_unmuted?).to be(false)

        # Pauses video
        find(audio_class).click

        expect(is_video_muted?).to be(false)
        expect(is_video_unmuted?).to be(true)

        # Plays video
        find(audio_class).click

        expect(is_video_muted?).to be(true)
        expect(is_video_unmuted?).to be(false)
      end
    end
  end

  describe "Events work properly" do
    it "should show pre-live messages" do
      visit path_for_video(video)

      # Messages from before stream should show
      first_message = video.chat_messages.first
      expect(first_message.timecode_ms).to eq(0)
      expect(page).to have_content(first_message.payload["message"])
    end

    it "should work for post-live messages" do
      late_message = create(
        :chat_message,
        input: {message: "Late to the party!"},
        user: create(:user),
        video: video,
        timecode_ms: 1_000,
      )
      # We need to reload to get the event we just added
      visit path_for_video(video)
      # We are starting at 0ms, but the below method will wait long enough to see it appear
      expect(page).to have_content(late_message.payload["message"])
    end
  end

  describe "Starting further into the video" do
    it "should show all chat messages" do
      late_message_text = "Late to the party!"
      create(
        :chat_message,
        input: {message: late_message_text},
        user: create(:user),
        video: video,
        timecode_ms: 9_999,
      )
      visit path_for_video(video, t: 1)
      expect(page).to have_content(ChatMessage.first.payload["message"])
      expect(page).to_not have_content(late_message_text)

      # Seeking SHOULD have that message!
      visit path_for_video(video, t: 10)
      # Messages from before stream should show
      first_message = ChatMessage.first
      expect(first_message.timecode_ms).to eq(0)
      expect(page).to have_content(first_message.payload["message"])
      expect(page).to have_content(late_message_text)
    end
  end
end
