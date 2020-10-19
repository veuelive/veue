# frozen_string_literal: true

require "system_helper"
require_relative("../support/audience_spec_helpers")

describe "Live Audience View" do
  include AudienceSpecHelpers

  let(:user) { create(:user) }
  let(:video) { create(:live_video) }

  before :example do
    resize_window_desktop
  end

  describe "a user is logged in" do
    before :each do
      visit videos_path
      login_as user
      visit video_path(video)
    end

    it "should allow for live chat messages to be sent" do
      write_chat_message "Cowabunga!"
      expect(page).to have_content("Cowabunga!").once
      expect(video.chat_messages.count).to be(1)

      # This seems odd, I know, but it's the main way to repo VEUE-144
      # as Turbolinks with the page transitions was doubling the number
      # of event handlers and this was causing multiple websockets to get
      # connected and caused repeated messages to appear
      3.times do
        find(".navbar-logo").click
        expect(current_path).to_not eq(video_path(video))
        find(".video-card").click
        expect(current_path).to eq(video_path(video))

        expect(page).to have_content("Cowabunga!").once
      end

      # And now that we've done some turbolinks transitions
      # let's verify our ActionCable connections are still functioning properly.
      write_chat_message "Cowabunga!"
      expect(page).to have_content("Cowabunga!").twice
    end

    it "should allow you to follow the streamer" do
      find(".follow-btn").click

      expect(page).to have_content("Unfollow")

      expect(video.user.followers).to include(user)
    end

    def write_chat_message(text)
      expect(page).to have_selector(".message-write")
      fill_in("message-input", with: text)
      find(".write-area textarea").native.send_keys(:enter)
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
      first_message = "Pizza time!"
      second_message = "Who wants pepperoni?"
      video.chat_messages.create!(user: other_user, input: {message: first_message})

      expect(page).to have_content(first_message)
      expect(page).to_not have_content(second_message)
      expect(page).to have_content(other_user.display_name)

      video.chat_messages.create!(user: other_user, input: {message: second_message})

      expect(page).to have_content(first_message)
      expect(page).to have_content(second_message)
      expect(page).to have_content(other_user.display_name)

      page.refresh

      # BUG: VEUE-81
      # We had a bug that was causing the following to break, so we refresh to
      # make sure that a visitor would see the content even if it's not coming
      # through the WS connection
      expect(page).to have_content(first_message)
      expect(page).to have_content(second_message)
      expect(page).to have_content(other_user.display_name)
    end

    it "should allow you to login without refreshing" do
      page.evaluate_script("window.not_reloaded = 'not reloaded';")
      expect(page).to have_content("Login")
      new_user = create(:user)
      login_as(new_user)
      expect(page.evaluate_script("window.not_reloaded")).to eq("not reloaded")
      expect(page).to have_content(new_user.display_name)
    end
  end

  describe "live watching" do
    it "should update the timecode" do
      visit(video_path(video))
      assert_video_is_playing
      expect(current_timecode).to be > 0
    end
  end
end
