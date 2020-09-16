# frozen_string_literal: true

require "rails_helper"

# Note: These tests are trying to test a sequence that doesn't NORMALLY happen just
# within the rails app. This has to be combined with the real Electron App to get full / perfect results.
describe "Broadcast View" do
  let(:user) { create(:user) }

  before :example do
    driven_by(:media_browser)
  end

  it "should load for a setup streamer" do
    visit "/"
    login_as(user)

    visit "/broadcast"

    logs = page.driver.browser.manage.logs.get(:browser)
    expect(logs).to be_empty
  end
end
