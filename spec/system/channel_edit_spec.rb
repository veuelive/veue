# frozen_string_literal: true

require "system_helper"

describe "channel edit" do
  let(:channel) { create(:channel) }

  describe "logged out user" do
    it "should not access channels edit page" do
      visit channel_edit_path(channel.id)
      expect(page).not_to(have_css("#channels__edit"))
    end

    it "should not access channels" do
      visit channels_path
      expect(page).not_to(have_css("#channels_index"))
    end
  end

  describe "user logged in" do
    before do
      resize_window_desktop
      login_as(channel.user)
      visit channel_edit_path(channel.id)
    end

    it "should be able to edit channel information" do
      expect(page).to have_css("#channels__edit")
      text = "channel"
      long_text = "channel bio text! " * 100

      fill_in "Channel Name", with: text
      fill_in "Bio", with: long_text
      click_on "Save Changes"

      expect(page).to have_content("Your channel was successfully updated")
    end
  end
end
