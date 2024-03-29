# frozen_string_literal: true

require "system_helper"
require "support/audience_spec_helpers"

describe "Broadcaster Media Deck" do
  include BroadcastSystemHelpers

  let(:channel) { create(:channel) }
  let(:user) { channel.user }

  before :each do
    resize_window_desktop
    login_as(user)
  end

  it "can share screen" do
    visit "/broadcasts"

    shift_to_broadcast_view

    wait_for_broadcast_state "ready"

    click_start_broadcast_button

    wait_for_broadcast_state "live"

    expect_video_capture_source_count(1, "camera")
    expect_video_capture_source_count(0, "screen")

    expect(VideoLayoutEvent.count).to eq(1)

    click_on("Share Your Screen")

    video_connected_css = "video[data-connected=true]"
    expect(page).to have_css(video_connected_css)

    # yes we are connected, but we should be hidden!
    expect_video_capture_source_count(1, "camera")
    expect_video_capture_source_count(0, "screen")

    # And so no video layout event either
    expect(VideoLayoutEvent.count).to eq(1)

    # that means we should also see the hidden overlay
    hidden_overlay_css = ".MediaDeck__screen-share__hidden-cover"
    expect(page).to have_css(hidden_overlay_css)

    # Let's click on it and start sharing!
    page.find(hidden_overlay_css).click

    # The overlay should be gone now
    expect(page).to_not have_css(hidden_overlay_css)

    # And we changed the layout
    expect(VideoLayoutEvent.count).to eq(2)

    # Now we should be sharing!
    expect_video_capture_source_count(1, "camera")
    expect_video_capture_source_count(1, "screen")

    # This simulates the resizing of the sharing content
    execute_script(
      %|
      document.querySelector(".MediaDeck__screen-share__video video").dispatchEvent(new CustomEvent("resize"))
|,
    )

    expect_video_capture_source_count(1, "camera")
    expect_video_capture_source_count(1, "screen")

    # The resize above should have triggered a third layout event
    expect(VideoLayoutEvent.count).to eq(3)

    click_on("Hide Screen")

    # And voila!
    expect(page).to have_css(hidden_overlay_css)

    # The screen capture preview is still there
    expect(page).to have_css(video_connected_css)

    # And we're back to the original layout
    expect(VideoLayoutEvent.count).to eq(4)

    # But not a capture source
    expect_video_capture_source_count(1, "camera")
    expect_video_capture_source_count(0, "screen")

    # Let's stop sharing entirely
    click_on("Stop Sharing")

    expect(page).to_not have_css(hidden_overlay_css)
    expect(page).to_not have_css("video[data-connected=true]")

    expect_video_capture_source_count(1, "camera")
    expect_video_capture_source_count(0, "screen")
  end
end
