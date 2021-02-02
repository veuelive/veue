# frozen_string_literal: true

require "system_helper"

describe "user profile" do
  let(:user) { create(:user) }

  before :example do
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
        all(".user-menu__item").first.click
        expect(page).to have_css("#profile-tab")
      end

      it "should show privacy tab" do
        all(".user-menu__item")[1].click
        expect(page).to have_css("#privacy-tab")
      end

      it "should show help tab" do
        all(".user-menu__item")[2].click
        expect(page).to have_css("#help-tab")
      end
    end

    describe "profile tab update user account" do
      before do
        find(".menu-area").hover
      end

      it "should update user and show message" do
        all(".user-menu__item")[0].click
        expect(page).to have_css("#profile-tab")

        find("#user_email").base.send_keys("test@user.com", :enter)

        expect(page).to have_content("Your profile was succesfully updated")
      end
    end

    describe "privacy tab delete user account" do
      before do
        find(".menu-area").hover
      end

      it "should remove user and redirect user after log out" do
        all(".user-menu__item")[1].click
        expect(page).to have_css("#privacy-tab")

        find(".privacy-profile__action").click
        page.driver.browser.switch_to.alert.accept

        expect(page).to have_content("Login")
      end
    end
  end
end
