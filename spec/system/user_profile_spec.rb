# frozen_string_literal: true

require "system_helper"

describe "user profile" do
  let(:user) { create(:user) }

  describe "logged out user" do
    it "should not access profile" do
      visit edit_user_path(user.id)
      expect(page).not_to(have_css("#users__edit"))
    end
  end

  describe "logged in user" do
    before do
      login_as(user)
      visit root_path
      resize_window_desktop
    end

    it "should have access to profile" do
      find(".menu-area").hover
      find_test_id("user-menu-profile").click
      expect(page).to have_css("#users__edit")

      long_text = "Hampton Is So Cool! " * 100

      fill_in "Public Name", with: long_text
      fill_in "Bio", with: long_text
      click_on "Save Changes"

      expect(page).to have_content("Your profile was successfully updated")

      user.reload
      expect(user.display_name).to eq(long_text.first(20))
      expect(user.about_me).to eq(long_text.first(160))

      find("#user_email").base.send_keys("test@user.com", :enter)
      expect(page).to have_content("Your profile was successfully updated")
      user.reload

      expect(user.email).to eq("test@user.com")

      find(".menu-area").hover

      # it "should show help tab" do
      find("#help-link").click
      expect(page).to have_css("#help-tab")

      # it "should show privacy tab" do
      find("#privacy-link").click
      expect(page).to have_css("#privacy-tab")

      # Let's delete their account!
      find(".privacy-profile__action").click
      page.driver.browser.switch_to.alert.accept

      expect(page).to have_content("Login")
      expect(User.where(id: user.id).count).to eq(0)
    end
  end
end
