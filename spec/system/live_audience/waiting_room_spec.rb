# frozen_string_literal: true

require "system_helper"
require_relative("../../support/audience_spec_helpers")

describe "Stream Waiting Room" do
  include AudienceSpecHelpers

  let(:user) { create(:user) }
  let(:video) { create(:upcoming_video) }

  describe "user get into waiting room" do
    before(:each) do
      visit videos_path
      login_as user
      visit video_path(video)
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
      expect(page).to have_content("Cowabunga!").once

      video.go_live!
      expect(page).to have_selector("#active-viewers")

      write_chat_message "Cowabunga!"
      expect(page).to have_content("Cowabunga!").twice
    end
  end
end
