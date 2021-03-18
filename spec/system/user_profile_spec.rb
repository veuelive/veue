# frozen_string_literal: true

require "system_helper"

describe "user profile" do
  let(:user) { create(:user) }

  before :example do
    driven_by :media_browser
    visit root_path
  end

  describe "logged out user" do
    it "should not access profile" do
      visit edit_user_path(user.id)
      expect(page).not_to(have_css("#users__edit"))
    end
  end

  describe "logged in user" do
    before do
      login_as(user)
    end

    it "should have access to profile" do
      visit edit_user_path(user.id)
      expect(page).to have_css("#users__edit")
    end

    describe "visit profile from navbar" do
      before do
        find(".menu-area").hover
      end

      it "should show profile tab" do
        find_test_id("user-menu-profile").click
        expect(page).to have_css("#profile-tab")
      end

      it "should show privacy tab" do
        find_test_id("user-menu-privacy").click
        expect(page).to have_css("#privacy-tab")
      end

      it "should show help tab" do
        find_test_id("user-menu-help").click
        expect(page).to have_css("#help-tab")
      end
    end

    describe "profile tab update user account" do
      before do
        find(".menu-area").hover
      end

      it "should update user and show message" do
        find_test_id("user-menu-profile").click
        expect(page).to have_css("#profile-tab")

        find("#user_email").base.send_keys("test@user.com", :enter)
        expect(page).to have_content("Your profile was successfully updated")
      end

      it "should stop you from entering too much text!" do
        click_link "Profile"

        long_text = "Hampton Is So Cool! " * 100

        fill_in "Public Name", with: long_text
        fill_in "Bio", with: long_text
        click_on "Save Changes"

        expect(page).to have_content("Your profile was successfully updated")

        user.reload
        expect(user.display_name).to eq(long_text.first(20))
        expect(user.about_me).to eq(long_text.first(160))
      end
    end

    describe "privacy tab delete user account" do
      before do
        find(".menu-area").hover
      end

      it "should remove user and redirect user after log out" do
        find_test_id("user-menu-privacy").click
        expect(page).to have_css("#privacy-tab")

        find(".privacy-profile__action").click
        page.driver.browser.switch_to.alert.accept

        expect(page).to have_content("Login")
      end
    end
  end
end
