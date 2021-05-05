# frozen_string_literal: true

require "system_helper"

describe "channel edit" do
  let(:channel) { create(:channel) }

  describe "logged out user" do
    it "should not access channels edit page" do
      visit edit_channel_path(channel.id)
      expect(page).not_to(have_css("#channels_index"))
    end
  end

  describe "user logged in" do
    before do
      # driven_by(:debug_browser)
      resize_window_desktop
      login_as(channel.user)
      visit edit_channel_path(channel.id)
    end

    it "should be able to edit channel information" do
      expect(page).to have_css("#channels__edit")
      text = "channel"
      long_text = "channel bio text! " * 100

      fill_in "Channel Name", with: ""
      fill_in "Channel Name", with: text
      fill_in "Bio", with: long_text
      click_on "Save Changes"
      expect(page).to have_content("Your channel was successfully updated")
    end

    it "should show & update all channels of user" do
      channel_two = create(:channel)
      user = channel.user
      user.channels << channel_two

      page.refresh
      expect(page).to have_css("#channels__edit")

      expect(page).to have_content(channel.name)
      expect(page).to have_content(channel_two.name)

      click_link(channel.name)
      fill_in "Channel Name", with: ""
      fill_in "Channel Name", with: "Test Updated"
      click_on "Save Changes"
      expect(page).to have_content("Your channel was successfully updated")

      channel.reload
      expect(channel.name).to eq("Test Updated")
    end
  end
end
