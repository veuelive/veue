# frozen_string_literal: true

require "system_helper"

# Note: These tests are trying to test a sequence that doesn't NORMALLY happen just
# within the rails app. This has to be combined with the real Electron App to get full / perfect results.
describe "Broadcast View" do
  let(:user) { create(:streamer) }
  let(:video) { user.videos.active.first }

  before :example do
    driven_by(:media_browser)
  end

  before :each do
    visit videos_path
    login_as(user)

    visit "/broadcasts"
    find("body").click
  end

  it "should load for a setup streamer" do
    expect(page).to have_css("div[data-broadcast-state='ready']")

    click_button("Start Broadcast")

    expect(page).to have_css("div[data-broadcast-state='live']")

    expect(page).to have_content("00:00:01")

    expect(Video.last.started_at_ms).to_not be_nil

    expect_no_javascript_errors
  end

  describe "before live streaming" do
    it "should allow me to change my URL" do
      bar = find("input[data-target='broadcast--browser.addressBar']")
      url = "https://1982.com"
      bar.set(url)
      bar.native.send_keys(:return)
      expect(find("*[data-broadcast--browser-url]")["data-broadcast--browser-url"]).to eq(url)
      find("*[data-broadcast-state='ready']")
      click_button("Start Broadcast")
      find("*[data-broadcast-state='starting']")

      expect(video).to be_live
      find("*[data-broadcast-state='live']")
      expect(BrowserNavigation.last.payload["url"]).to eq(url)

      visit video_path(video)
      expect(find("#address-input").text).to eq(url)
    end
  end

  describe "while live streaming" do
    before :each do
      click_button("Start Broadcast")
    end

    describe "navigation events" do
      it "should have an initial navigation event" do
        find("*[data-broadcast-state='live']")
        expect(video.browser_navigations).to be_any

        visit video_path(video)
        expect(find("#address-input").text).to start_with("http")
      end
    end
  end
end
