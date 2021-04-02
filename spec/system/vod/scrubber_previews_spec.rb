# frozen_string_literal: true

require "system_helper"

describe "Scrubber previews" do
  # Make the video 100 seconds long
  let(:video) { create(:vod_video) }

  before(:each) do
    driven_by :media_browser
    visit path_for_video(video)
  end

  describe "With snapshots" do
    # All need to be eagerly created to be able to show on hover
    let!(:snapshot_one) { create(:video_snapshot, video: video, timecode: 0) }
    let!(:snapshot_two) { create(:video_snapshot, video: video, timecode: 31_000) }

    it "Should show a video preview on mouse hover" do
      find(".progress-bar-container").hover

      # first paint can be slow in testing, give it a little extra wait time
      expect(page).to have_css(".progress-bar__time-preview")
      expect(page).to have_css(".progress-bar__video-preview")

      # Make sure the image has the id of snapshot 1
      expect(page).to have_css("[data-id='#{snapshot_one.id}'")
    end

    it "Should show the next snapshot at ~ 30 seconds" do
      # This is super finnicky and totally dependent on the video and viewport size,
      # so take care if the test video changes!
      script = <<~JS
        const container = document.querySelector(".progress-bar-container")

        const { width, x, y } = container.getBoundingClientRect()

        // Approximate guess of 30 seconds
        const offset = (width / 2) + 100
        container.dispatchEvent(new PointerEvent("pointerenter", {clientX: x + offset, clientY: y, view: window}))
      JS

      execute_script(script)

      expect(page).to have_css(".progress-bar__time-preview")
      expect(page).to have_css(".progress-bar__video-preview")

      # We have to re-execute the script to get it to re-hover
      execute_script(script)

      # Make sure the image has the id of snapshot 2, this can take a little while to happen.
      expect(page).to have_css("[data-id='#{snapshot_two.id}'")
    end
  end

  describe "Without snapshots" do
    it "Should show a blank preview with no images" do
      find(".progress-bar-container").hover

      # Preview time and image container should still show
      expect(page).to have_css(".progress-bar__time-preview")
      expect(page).to have_css(".progress-bar__video-preview")

      expect(find(".progress-bar__video-preview__image", visible: false)).not_to(be_visible)
    end
  end
end