# frozen_string_literal: true

require "system_helper"

# Note: These tests are trying to test a sequence that doesn't NORMALLY happen just
# within the rails app. This has to be combined with the real Electron App to get full / perfect results.
describe "Broadcast View" do
  include BroadcastSystemHelpers

  let(:streamer) { create(:streamer) }
  let(:follower) { create(:user) }
  let(:other_follower) { create(:user) }
  let(:video) { streamer.videos.active.first }

  before :example do
    driven_by :media_browser
    resize_window_desktop
    Follow.create!(streamer_follow: follower, user_follow: streamer)
    Follow.create!(streamer_follow: other_follower, user_follow: streamer)
  end

  before :each do
    visit videos_path
    login_as(streamer)

    visit "/broadcasts"
    find("body").click
  end

  it "should load for a setup streamer" do
    expect(page).to have_css("div[data-broadcast-state='ready']")

    click_button("Start Broadcast")

    expect(page).to have_css("div[data-broadcast-state='live']")

    expect(page).to have_content("Stop Broadcast")

    find("div[data-broadcast-started-at]")

    expect(Video.last.started_at_ms).to_not be_nil

    expect_no_javascript_errors
  end

  describe "before live streaming" do
    it "should allow me to change my URL" do
      navigate_to(url = "https://1982.com")

      find("*[data-broadcast-state='ready']")
      click_button("Start Broadcast")
      find("*[data-broadcast-started-at]")

      expect(video).to be_live
      find("*[data-broadcast-state='live']")
      expect(BrowserNavigation.last.payload["url"]).to eq(url)

      visit video_path(video)
      expect(find("#address-input").text).to eq(url)
    end

    it "properly updates the title of the broadcast" do
      title_input = "input[name='title']"
      expect(video.title).to be_nil
      new_title = "Look at my fancy title"

      find(title_input).fill_in(with: new_title).native.send_keys(:enter)

      # Makes us wait to know the title was updated
      expect(page).to have_css("input[data-db-value='#{new_title}'")
      expect(page).to have_field("title", with: new_title)
      video.reload
      expect(video.title).to eq(new_title)

      # Survives page refresh
      page.refresh
      expect(page).to have_field("title", with: new_title)
    end
  end

  describe "start the broadcast" do
    it "should queue a SendBroadcastStartTextJob" do
      # Just in case, lets clear out our jobs
      clear_enqueued_jobs

      click_button("Start Broadcast")
      find("*[data-broadcast-state='live']")

      server = Capybara.current_session.server
      current_video_url = video_url(video, host: server.host, port: server.port)

      perform_enqueued_jobs(only: SendBroadcastStartTextJob)

      message1 = FakeTwilio.messages.first
      message2 = FakeTwilio.messages.last

      # Verify it sends to different phone numbers
      expect(message1.to).to_not eq(message2.to)

      expect(message1.body).to match(/#{streamer.display_name}/)
      expect(message1.body).to match("live")

      expect(message1.body).to match(current_video_url)
    end

    it "should not be able to start a broadcast with a 'starting' state on your video" do
      video.update!(state: "starting")
      previous_path = page.current_path

      # Should just redirect us to a new broadcast like if it was "live""
      page.refresh

      expect(page.current_path).to_not eq(previous_path)
    end
  end

  describe "while live streaming" do
    before :each do
      click_button("Start Broadcast")
      # For most of these, it's important we wait until we are actually "live"
      # and things like the WS connection are open
      find("*[data-broadcast-state='live']")
    end

    describe "reload page" do
      it "should load with new video" do
        # Refreshing view while broadcasting live video
        page.refresh
        expect(find("#broadcast")["data-broadcast-video-state"]).to eq("pending")
      end
    end

    describe "navigation events" do
      it "should have an initial navigation event" do
        expect(video.browser_navigations).to be_any

        visit video_path(video)
        expect(find("#address-input").text).to start_with("http")
      end
    end

    describe "chat message events" do
      include AudienceSpecHelpers

      it "should display live messages on broadcaster view" do
        first_message = someone_chatted
        second_message_text = "Cowabunga!"

        expect(video.chat_messages.count).to eq(1)

        # VEUE-257 - Navigation events can throw off processing after being live
        navigate_to("https://1982.com")

        expect(find(".message-left")).to have_content(first_message.text)
        expect(page).to_not have_content(second_message_text)
        expect(page).to have_content(first_message.user.display_name)

        someone_chatted(second_message_text)

        expect(page).to have_content(first_message.text)
        expect(page).to have_content(second_message_text)
        expect(page).to have_content(first_message.user.display_name)
      end

      it "should allow for live chat messages to be sent" do
        write_chat_message "Cowabunga!"
        expect(page).to have_content("Cowabunga!").once
        expect(video.chat_messages.count).to be(1)

        write_chat_message "Pizza time!"
        expect(page).to have_content("Pizza time!").once
      end
    end

    describe "update title feature" do
      title_input = "input[name='title']"
      title_submit = "button[data-target='broadcast--title.submit']"

      it "updates the broadcast on button click" do
        new_title = "super cool new title"

        find(title_input).fill_in(with: new_title)

        find(title_submit).click

        expect(page).to have_css("input[data-db-value='#{new_title}'")
        video.reload
        expect(video.title).to eq(new_title)

        # does NOT survive page refresh
        page.refresh
        expect(page).to have_field("title", with: "")
      end

      it "updates the broadcast on enter key" do
        new_title = "this is my title"

        find(title_input).fill_in(with: new_title)

        find(title_submit).native.send_keys(:enter)

        expect(page).to have_css("input[data-db-value='#{new_title}'")
        video.reload
        expect(video.title).to eq(new_title)
      end

      it "should not persist through page load after broadcast start" do
        new_title = "this is my title"

        find(title_input).fill_in(with: new_title).native.send_keys(:enter)
        expect(page).to have_field("title", with: new_title)

        page.refresh
        expect(page).to have_field("title", with: "")
      end

      it "should reset the title on blur" do
        new_title = "im typing a title"

        find(title_input).click
        find(title_input).fill_in(with: new_title)

        expect(page).to have_field("title", with: new_title)

        # simulates element.blur()
        find("body").click

        # Blur set timeout is 2 seconds.
        using_wait_time(5) do
          expect(page).to have_field("title", with: "")
        end
      end
    end
  end
end
