# frozen_string_literal: true

require "rails_helper"

describe "Prerecorded Audience View" do
  before :example do
    driven_by(:selenium_chrome_headless)
  end

  let(:video) { create(:video, {hls_url: "/__test/vod/playback.m3u8"}) }

  def is_video_playing?
    find("div[data-controller='audience-view']", visible: false)["data-audience-view-state"] == "playing"
  end

  describe "anonymous user" do
    it "should have a video to play!" do
      visit video_path(video.to_param)

      loop do
        break if is_video_playing?

        play = find("a[title='Toggle Play']")
        play.click
      end

      page.find("*[data-target=\"audience-view.timeDisplay\"]", text: "00:00:01", wait: 5)
    end
  end
end
