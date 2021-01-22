# frozen_string_literal: true

require "system_helper"

describe "VOD Player Controls" do
  include AudienceSpecHelpers

  let(:user) { create(:user) }
  let(:video) { create(:vod_video) }

  before :each do
    resize_window_desktop
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
        audio_class = ".toggle-audio.desktop"

        # Only the desktop buttons should be visible on desktop
        expect(page).to have_css(audio_class, visible: true)
        expect(page).to have_css(".toggle-play.mobile", visible: false)

        # Video should be automuted
        expect(is_video_muted?).to be(true)
        expect(is_video_unmuted?).to be(false)

        # Unmutes Video
        find(audio_class).click

        expect(is_video_muted?).to be(false)
        expect(is_video_unmuted?).to be(true)

        expect(page).to have_css(audio_class, visible: false)

        # Mutes
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
end
