# frozen_string_literal: true

require "system_helper"
require_relative("../../support/audience_spec_helpers")

describe "chat during live video" do
  include AudienceSpecHelpers
  let(:user) { create(:user) }
  let(:video) { create(:live_video) }
  let(:channel) { video.channel }

  before :example do
    resize_window_desktop
  end

  describe "when a user is logged in" do
    before :each do
      visit root_path
      login_as user
      visit channel_path(channel)
    end

    it "should allow for live chat messages to be sent" do
      write_chat_message "Cowabunga!"
      expect(page).to have_content("Cowabunga!").once
      expect(video.chat_messages.count).to eq(1)

      # This seems odd, I know, but it's the main way to repo VEUE-144
      # as Turbolinks with the page transitions was doubling the number
      # of event handlers and this was causing multiple websockets to get
      # connected and caused repeated messages to appear
      3.times do
        find(".header__left__logo").click
        visit("/")
        expect(current_path).to_not eq(channel_path(channel))
        find(".video-card.live").click
        expect(current_path).to eq(channel_path(channel))
        expect(page).to have_content("Follow")

        expect(page).to have_content("Cowabunga!").once
      end

      # And now that we've done some turbolinks transitions
      # let's verify our SSE connections are still functioning properly.
      write_chat_message "Cowabunga!"
      expect(page).to have_content("Cowabunga!").twice
    end

    it "should show that you joined the chat" do
      assert_video_is_playing
      expect(page).to have_content("#{user.display_name} joined the chat")
    end

    it "should have visible scroll button after a bunch of messages" do
      13.times do |i|
        write_chat_message "Cowabunga!"
        expect(page).to have_css(".message", count: i + 1)
      end

      chat_message = first(".message")
      scroll_to(chat_message)

      expect(page).to have_css(".chat-scroll")

      last_message = all(".messages").last
      scroll_to(last_message, align: :bottom)

      expect(page).to have_no_css(".chat-scroll")
    end
  end

  describe "logged out user" do
    before :each do
      visit channel_path(channel)
    end

    it "should show you joined after you logged in" do
      expect(page).to_not(have_content("#{user.display_name} joined the chat"))
      login_as user
      expect(page).to(have_content("#{user.display_name} joined the chat"))
    end

    it "should not allow you to chat until you login" do
      login_as user
      write_chat_message "Who ordered a pizza?"
      expect(page).to have_content("Who ordered a pizza?")
    end

    it "should show messages from other users" do
      first_message = someone_chatted
      second_message_text = "Cowabunga!"

      expect(page).to have_content(first_message.text)
      expect(page).to_not have_content(second_message_text)
      expect(page).to have_content(first_message.user.display_name)

      someone_chatted(second_message_text)

      expect(page).to have_content(first_message.text)
      expect(page).to have_content(second_message_text)
      expect(page).to have_content(first_message.user.display_name)

      page.refresh

      # BUG: VEUE-81
      # We had a bug that was causing the following to break, so we refresh to
      # make sure that a visitor would see the content even if it's not coming
      # through the WS connection
      expect(page).to have_content(first_message.text)
      expect(page).to have_content(second_message_text)
      expect(page).to have_content(first_message.user.display_name)
    end

    it "should have highlighted comment of streamer" do
      expect(page).not_to(have_selector(".message-write"))

      # It is mocking comment of streamer
      login_as video.user
      write_chat_message "Cowabunga!"
      expect(page).to have_content("Cowabunga!").once
      logout_user

      # Watching stream as a common visitor
      visit path_for_video(video)

      expect(page).to have_content("Cowabunga!").once
      expect(page).to have_css(".message--highlighted")
    end

    it "should see login modal on chat area click" do
      expect(page).to have_css(".message-login-prompt")
      find(".message-login-prompt").click

      expect(page).to have_css("#phone_number_input")
    end

    it "should show the message even if rejected" do
      login_as user

      # Must come after to allow the user to be created
      PerspectiveApi.key = "FAIL"
      bad_word = "profanity"
      write_chat_message bad_word
      expect(page).to have_content(bad_word)

      visit channel_path(channel)

      expect(page).to have_no_content(bad_word)
    end
  end
end
