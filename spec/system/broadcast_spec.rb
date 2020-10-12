# frozen_string_literal: true

require "rails_helper"

# Note: These tests are trying to test a sequence that doesn't NORMALLY happen just
# within the rails app. This has to be combined with the real Electron App to get full / perfect results.
describe "Broadcast View" do
  let(:user) { create(:streamer) }

  before :example do
    driven_by(:media_browser)
  end

  it "should load for a setup streamer" do
    visit videos_path
    login_as(user)

    visit "/broadcasts"

    logs = page.driver.browser.manage.logs.get(:browser)
    expect(logs).to be_empty

    expect(page).to have_css("div[data-broadcast-state='ready']")

    click_button("Start Broadcast")

    expect(page).to have_css("div[data-broadcast-state='live']")

    expect(page).to have_content("00:00:01")

    expect(Video.last.started_at_ms).to_not be_nil
  end
end
