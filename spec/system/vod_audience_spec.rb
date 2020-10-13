# frozen_string_literal: true

require "rails_helper"
require_relative("../support/audience_spec_helpers")

describe "Prerecorded Audience View" do
  include AudienceSpecHelpers

  before :example do
    driven_by(:selenium_chrome_headless)
  end

  let(:video) { create(:video, {hls_url: "/__test/vod/playback.m3u8"}) }

  describe "anonymous user" do
    it "should have a video to play!" do
      visit video_path(video)

      assert_video_is_playing

      expect(is_video_playing?).to eq(true)

      expect(current_timecode).to be > 0
    end
  end
end
