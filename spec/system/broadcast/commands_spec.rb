# frozen_string_literal: true

require "system_helper"

describe "Broadcast Commands" do
  include BroadcastSystemHelpers

  let(:channel) { create(:channel) }

  before :example do
    driven_by :media_browser
    resize_window_desktop
  end

  before :each do
    visit root_path
    login_as(channel.user)

    visit "/broadcasts"
    find("body").click
  end

  def channel_share_link
    server = Capybara.current_session.server
    channel_url(channel, host: server.host, port: server.port)
  end

  def private_share_link
    server = Capybara.current_session.server
    channel_video_url(channel.id, channel.active_video, host: server.host, port: server.port)
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
      expect(clip_text).to eq(channel_share_link)
      expect(clip_text).to include(channel.slug)
    end

    it "can open a new link" do
      find(".btn#share-btn").click
      expect(find(".btn#share-btn .select-menu")).to have_content("Copy")
      audience_window =
        window_opened_by do
          find(".item.open").click
        end
      switch_to_window audience_window
      expect(current_url).to eq(channel_share_link)
    end

    describe "Change urls when private" do
      before do
        find("#settings-btn").click
        within(".broadcast-settings__form") do
          select("private", from: "video_visibility")
          click_button("Update")
        end
        expect(page).to have_css("[data-video-visibility='private']")
      end

      it "should copy the private link" do
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

        expect(clip_text).to eq(private_share_link)
        expect(clip_text).to include(channel.id)
        expect(clip_text).to include(channel.active_video.id)
      end

      it "should open the private link" do
        find(".btn#share-btn").click
        expect(find(".btn#share-btn .select-menu")).to have_content("Copy")
        audience_window =
          window_opened_by do
            find(".item.open").click
          end
        switch_to_window audience_window
        expect(current_url).to eq(private_share_link)
      end
    end
  end
end
