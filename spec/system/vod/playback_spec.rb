# frozen_string_literal: true

require "system_helper"

describe "Prerecorded Audience View" do
  include AudienceSpecHelpers

  let(:video) { create(:vod_video) }
  let(:channel) { video.channel }

  before :example do
    driven_by :media_browser
    resize_window_desktop
  end

  before :each do
    3.times.map do |x|
      # Creates 0, 16s, and 24s time stamped events
      timecode = x * 16_000

      create(:chat_message, video: video, timecode_ms: timecode)
    end

    visit path_for_video(video)
    assert_video_is_playing
    ensure_controls_visible
  end

  describe "When you move to the video scrubber to ~16 seconds" do
    it "should not show the very last chat message" do
      last_message = video.chat_messages.last
      expect(page).to have_no_css("#message-#{last_message.id}")
    end
  end

  it "scheduled shows visible during VOD" do
    channel.update!(
      schedule: {
        days_of_the_week: ["Sunday"],
        type: "weekly",
        timezone: "UTC",
        minute_of_day: 930,
      },
    )

    visit path_for_video(video)

    expect(page).to have_content("Next Live Show")
  end
end
