# frozen_string_literal: true

require "system_helper"

describe "settings" do
  let(:user) { create(:user) }

  before :example do
    visit root_path
  end

  describe "logged out user" do
    it "should not access settings" do
      visit user_settings_path(user.id)
      expect(page).not_to(have_css("#settings__index"))
    end
  end

  describe "logged in user" do
    before do
      login_as(user)
    end

    it "should have access to settings" do
      visit user_settings_path(user.id)
      expect(page).to have_css("#settings__index")
    end

    describe "visit settings from navbar" do
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
  end
end
