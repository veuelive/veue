# frozen_string_literal: true

require "system_helper"

describe "Scrubber previews" do
  include AudienceSpecHelpers
  let(:video) { create(:vod_video) }

  before(:each) do
    driven_by :media_browser
    resize_window_desktop
    visit path_for_video(video)
    assert_video_is_playing(10)
    ensure_controls_visible
  end

  describe "With snapshots" do
    # All need to be eagerly created to be able to show on hover
    let!(:snapshot_one) { create(:video_snapshot, video: video, timecode: 0) }
    let!(:snapshot_two) { create(:video_snapshot, video: video, timecode: 30_000) }
    let!(:snapshot_three) { create(:video_snapshot, video: video, timecode: 60_000) }

    it "Should show a video preview on mouse hover" do
      find(".progress-bar-container").hover

      # first paint can be slow in testing, give it a little extra wait time
      expect(page).to have_css(".progress-bar__time-preview")
      expect(page).to have_css(".progress-bar__video-preview")

      # We have to rehover to redisplay the image
      find(".progress-bar-container").hover

      # Make sure the image has the id of snapshot 0, this takes a while, add an extra wait
      expect(page).to have_css(
        ".progress-bar__video-preview__image[src*='/#{video.channel.slug}/videos/#{video.id}/snapshots/0.jpg'", wait: 5
      )
    end

    it "Should show the next snapshot at ~ 30 seconds" do
      # This is super finnicky and totally dependent on the video and viewport size,
      # so take care if the test video changes!
      script = <<~JS
        const container = document.querySelector(".progress-bar-container")
        const { width, x, y } = container.getBoundingClientRect()
        // Approximate guess of 30 seconds
        const offset = (width / 1.5)
        container.dispatchEvent(new PointerEvent("pointerenter", {clientX: x + offset, clientY: y, view: window}))
      JS

      execute_script(script)

      expect(page).to have_css(".progress-bar__time-preview")
      expect(page).to have_css(".progress-bar__video-preview")

      # We have to re-execute the script to get it to re-hover
      execute_script(script)

      query = ".progress-bar__video-preview__image[src*='/#{video.channel.slug}/videos/#{video.id}/snapshots/1.jpg'"
      # Make sure the image has the timecode of 1
      expect(page).to have_css(query, wait: 10)
    end
  end

  describe "Without snapshots" do
    it "Should show a blank preview with no images" do
      find(".progress-bar-container").hover

      # Preview time and image container should still show
      expect(page).to have_css(".progress-bar__time-preview")
      expect(page).to have_css(".progress-bar__video-preview")

      expect(find(".progress-bar__video-preview__image")).to be_visible
    end
  end
end
