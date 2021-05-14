# frozen_string_literal: true

require "system_helper"
require "support/audience_spec_helpers"

describe "Browser Broadcaster Startup Flow" do
  describe "browser startup" do
    before :example do
      driven_by(:selenium, using: :firefox)
    end

    it "should display warning if not on chrome" do
      visit "/broadcasts/startup"
      expect(page).to have_content(I18n.t("discover.browser_warning"))
    end
  end
end
