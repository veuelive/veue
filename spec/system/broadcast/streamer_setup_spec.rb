# frozen_string_literal: true

require "system_helper"
require("support/audience_spec_helpers")

describe "Broadcaster Startup Flow" do
  let(:user) { create(:user) }

  it "should ask for media access if there is no access yet" do
    visit "/broadcasts/startup"
    click_button "Prompt For Access"
    # Unfortunately, we can't test the flow for asking for media access
    # beyond just knowing that we detected they didn't have access
  end

  describe "with media access" do
    before :example do
      driven_by(:media_browser)
    end

    it "should ask you to login" do
      visit "/broadcasts/startup"
      login_as user

      # We should then load the broadcast page
      find("#broadcast")
      expect(user.videos.count).to eq(1)
      expect(current_path).to eq(broadcast_path(user.videos.first))
    end
  end
end
