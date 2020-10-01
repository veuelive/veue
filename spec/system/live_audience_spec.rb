# frozen_string_literal: true

require "rails_helper"

describe "Live Audience View" do
  let(:user) { create(:user) }
  let(:video) { create(:live_video) }

  before :example do
    driven_by(:selenium_chrome_headless)
    resize_window_desktop
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

    it "should show messages from other users" do
      other_user = create(:user)
      message = "Pizza time!"
      video.chat_messages.create!(user: other_user, input: {message: message})

      expect(page).to have_content(message)
      expect(page).to have_content(other_user.display_name)

      page.refresh

      # BUG: VEUE-81
      # We had a bug that was causing the following to break, so we refresh to
      # make sure that a visitor would see the content even if it's not coming
      # through the WS connection
      expect(page).to have_content(message)
      expect(page).to have_content(other_user.display_name)
    end
  end
end
