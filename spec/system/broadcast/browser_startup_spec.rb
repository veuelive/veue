# frozen_string_literal: true

require "system_helper"
require "support/audience_spec_helpers"

describe "Browser Broadcaster Startup Flow" do
  before :example do
    driven_by(:selenium, using: :headless_firefox)
  end

  describe "browser startup" do
    it "should display warning if not on chrome" do
      puts "-=-=-=-=-=-=\n"*8
      puts page.driver.browser
      visit "/broadcasts/startup"
      expect(page).to have_content(I18n.t("discover.browser_warning"))
    end
  end
end
