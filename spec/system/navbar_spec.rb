# frozen_string_literal: true

require "system_helper"

RSpec.describe "Navbar State" do
  let(:user) { create(:user) }

  describe "navbar view on different screens" do
    before do
      visit videos_path
    end

    after do
      resize_window_desktop
    end

    it "should have mobile menu visible" do
      resize_window_to_mobile
      expect(has_css?("#open-menu")).to be(true)
    end

    it "should have mobile menu invisible" do
      resize_window_desktop
      expect(has_css?("#open-menu")).to be(false)
    end
  end

  describe "navbar mobile view" do
    before do
      resize_window_to_mobile
    end

    after do
      resize_window_desktop
    end

    describe "login user" do
      before(:each) do
        visit root_path
        login_as(user)
      end

      it "should display user name and signout link in sidebar" do
        click_button("open-menu")

        expect(page).to have_selector(".status-user__text")
        expect(page).to have_selector(:link_or_button, "Sign Out")
      end
    end

    describe "guest viewer" do
      before(:each) do
        visit root_path
      end

      it "should have login button" do
        click_button("open-menu")
        expect(page).to have_selector(:link_or_button, "Login")
      end
    end
  end
end
