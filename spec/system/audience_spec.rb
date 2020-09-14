# frozen_string_literal: true

require "rails_helper"

describe "Audience View" do
  let(:user) { create(:user) }
  let(:video) { create(:video) }

  before :example do
    driven_by(:selenium_chrome_headless)
  end

  describe "a user is logged in" do
    before :each do
      login_as user
      visit video_path(video)
    end

    it "should allow for chat messages to be sent" do
      expect(page).to have_selector(".message-write")
    end
  end

  describe "an anonymous user" do
    before :each do
      visit video_path(video)
    end

    it "should not allow you to chat" do
      expect(page).not_to(have_selector(".message-write"))
    end
  end
end
