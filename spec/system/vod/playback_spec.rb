# frozen_string_literal: true

require "system_helper"

describe "Prerecorded Audience View" do
  include AudienceSpecHelpers

  let(:video) { create(:vod_video) }

  before :example do
    driven_by :media_browser
    resize_window_desktop
  end

  before :each do
    3.times.map do |x|
      # Creates 0, 16s, and 24s time stamped events
      timecode = x * 16_000

      create(:browser_navigation, video: video, timecode_ms: timecode)
      create(:chat_message, video: video, timecode_ms: timecode)
    end

    visit path_for_video(video)
    expect(is_video_playing?).to be(true)
  end

  describe "When you move to the video scrubber to ~16 seconds" do
    before :each do
      find(".progress-bar-container").click
    end

    it "should not show the very last chat message" do
      last_message = video.chat_messages.last
      expect(page).to have_no_css("#message-#{last_message.id}")
    end
  end
end
