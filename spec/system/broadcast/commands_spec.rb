# frozen_string_literal: true

require "system_helper"

describe "Broadcast Commands" do
  include BroadcastSystemHelpers

  let(:streamer) { create(:streamer) }
  let(:follower) { create(:user) }
  let(:other_follower) { create(:user) }
  let(:video) { streamer.videos.active.first }

  before :example do
    driven_by :media_browser
    resize_window_desktop
    Follow.create!(streamer_follow: follower, user_follow: streamer)
    Follow.create!(streamer_follow: other_follower, user_follow: streamer)
  end

  before :each do
    visit videos_path
    login_as(streamer)

    visit "/broadcasts"
    find("body").click
  end

  def video_share_link(video)
    server = Capybara.current_session.server
    video_url(video, host: server.host, port: server.port)
  end

  describe "share features" do
    it "can copy the stream URL to the clipboard while streaming" do
      page.driver.browser.execute_cdp(
        "Browser.grantPermissions",
        origin: page.server_url,
        permissions: ["clipboardReadWrite"],
      )
      find(".btn#share-btn").hover
      expect(page).to have_content("Share")
      find(".btn#share-btn").click
      expect(find(".btn#share-btn .select-menu")).to have_content("Copy")
      find(".item.copy").click
      accept_alert
      clip_text = page.evaluate_async_script("navigator.clipboard.readText().then(arguments[0])")
      expect(clip_text).to eq(video_share_link(video))
    end

    it "can open a new link" do
      find(".btn#share-btn").click
      expect(find(".btn#share-btn .select-menu")).to have_content("Copy")
      audience_window =
        window_opened_by do
          find(".item.open").click
        end
      switch_to_window audience_window
      expect(current_url).to eq(video_share_link(video))
    end
  end
end
