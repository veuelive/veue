# frozen_string_literal: true

require "system_helper"

describe "Broadcaster Browser Area" do
  include BroadcastSystemHelpers

  let(:streamer) { create(:streamer) }
  let(:channel) { streamer.channels.first }
  let(:video) { channel.active_video }

  before :example do
    driven_by :media_browser
    resize_window_desktop
  end

  before :each do
    login_as(streamer)

    visit "/broadcasts"
    find("body").click
  end

  it "should call to create a browser view with the proper size" do
    wait_for_broadcast_state("ready")

    browser_message = evaluate_script("globalThis.ipcRenderer.getFirstChannelMessagePayload('createBrowserView');")
    expect(browser_message["bounds"]["width"]).to be > 100
  end
end
