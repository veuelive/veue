# frozen_string_literal: true

require "system_helper"
require_relative("../../support/audience_spec_helpers")

describe "Stream Waiting Room" do
  include AudienceSpecHelpers

  let(:user) { create(:user) }
  let(:video) { create(:upcoming_video) }
  let(:channel) { video.channel }

  describe "user get into waiting room" do
    before(:each) do
      login_as user
      visit channel_path(channel)
      ensure_live_event_source
    end

    it "should show stream not started notification" do
      expect(page).to have_content("Starting").once
    end

    it "should should not have primary & secondary canvases" do
      expect(page).to_not have_selector(".primary-canvas")
      expect(page).to_not have_selector(".fixed-secondary-canvas")
    end

    it "should allow for live chat messages to be sent" do
      write_chat_message "Cowabunga!"
      expect(page).to have_content("Cowabunga!").once
      expect(video.chat_messages.count).to be(1)

      write_chat_message "Cowabunga!"
      expect(page).to have_content("Cowabunga!").twice
    end

    it "should reload the view after video go live" do
      write_chat_message "Cowabunga!"
      expect(page).to have_content("Cowabunga!", wait: 5).once

      video.go_live!
      expect(page).to have_selector("#active-viewers", wait: 10)
      expect(page).to have_selector(".primary-canvas")

      write_chat_message "Cowabunga!"
      expect(page).to have_content("Cowabunga!").twice
    end
  end
end
