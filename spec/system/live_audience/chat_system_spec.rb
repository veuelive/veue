# frozen_string_literal: true

require "system_helper"
require_relative("../../support/audience_spec_helpers")

describe "chat" do
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
      expect(video.chat_messages.count).to be(1)

      # This seems odd, I know, but it's the main way to repo VEUE-144
      # as Turbolinks with the page transitions was doubling the number
      # of event handlers and this was causing multiple websockets to get
      # connected and caused repeated messages to appear
      3.times do
        find(".navbar-logo").click
        expect(current_path).to_not eq(channel_path(channel))
        find(".video-card").click
        expect(page).to have_content("Follow")
        expect(current_path).to eq(channel_path(channel))

        expect(page).to have_content("Cowabunga!").once
      end

      # And now that we've done some turbolinks transitions
      # let's verify our SSE connections are still functioning properly.
      write_chat_message "Cowabunga!"
      expect(page).to have_content("Cowabunga!").twice
    end

    it "should show that you joined the chat" do
      expect(page).to have_content(user.display_name + " joined the chat")
    end

    it "should have visible scroll button after a bunch of messages" do
      10.times do |i|
        write_chat_message "Cowabunga!"
        expect(page).to have_css(".message-display", count: i + 1)
      end

      chat_message = first(".message-display")
      execute_script("arguments[0].scrollIntoView(true)", chat_message)

      expect(page).to have_css(".chat-scroll")

      messages = find(".messages")
      execute_script("arguments[0].lastElementChild.scrollIntoView(true)", messages)

      expect(page).to_not have_css(".chat-scroll")
    end
  end

  describe "logged out user" do
    before :each do
      visit channel_path(channel)
    end

    it "should show you joined after you logged in" do
      expect(page).to_not(have_content(user.display_name + " joined the chat"))
      login_as user
      expect(page).to(have_content(user.display_name + " joined the chat"))
    end

    it "should not allow you to chat until you login" do
      expect(page).not_to(have_selector(".message-write"))
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
  end
end
