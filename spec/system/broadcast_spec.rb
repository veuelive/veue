# frozen_string_literal: true

require "system_helper"

# NOTE: These tests are trying to test a sequence that doesn't NORMALLY happen just
# within the rails app. This has to be combined with the real Electron App to get full / perfect results.
describe "Broadcast View" do
  include BroadcastSystemHelpers

  let(:streamer) { create(:streamer) }
  let(:channel) { streamer.channels.first }
  let(:video) { channel.active_video }
  let(:settings_form) { ".broadcast-settings__form" }

  before :example do
    driven_by :media_browser
    resize_window_desktop
  end

  before :each do
    visit "/"
    login_as(streamer)

    visit "/broadcasts"
    find("body").click
  end

  it "should load for a setup streamer" do
    wait_for_broadcast_state("ready")

    click_start_broadcast_button

    expect(page).to have_css("div[data-broadcast-state='live']", wait: 5)

    expect(page).to have_css(".stop-btn", wait: 5)

    find("div[data-broadcast-started-at]")

    expect(Video.last.started_at_ms).to_not be_nil

    expect_no_javascript_errors
  end

  describe "before live streaming" do
    it "should allow me to change my URL" do
      navigate_to(url = "https://1982.com")

      wait_for_broadcast_state("ready")
      click_start_broadcast_button
      find("*[data-broadcast-started-at]")

      expect(video).to be_live
      wait_for_broadcast_state("live")
      expect(BrowserNavigation.published.last.payload["url"]).to eq(url)

      visit channel_path(streamer.channels.first)
      expect(find("#address-input")).to have_text(url)
    end
  end

  describe "start the broadcast" do
    before do
      5.times { create(:follow, user: create(:user), channel: channel) }
    end

    it "should queue a SendBroadcastStartTextJob and IFTTT job" do
      # Just in case, lets clear out our jobs
      clear_enqueued_jobs

      wait_for_broadcast_state("ready")

      click_start_broadcast_button
      expect(page).to have_content("Starting")
      wait_for_broadcast_state("live")

      server = Capybara.current_session.server
      current_video_url = channel_path(channel, host: server.host, port: server.port)

      # Needs to be called twice to send text messages
      2.times do
        perform_enqueued_jobs
      end

      expect(WebMock).to have_requested(:post, IfThisThenThatJob.post_url).once

      first_message = FakeTwilio.messages.first
      second_message = FakeTwilio.messages.last

      # Verify it sends to different phone numbers on stream start
      expect(first_message.to).to_not eq(second_message.to)
      expect(channel.followers.pluck(:phone_number)).to include(first_message.to)

      expect(first_message.body).to match(/#{streamer.display_name}/)
      expect(first_message.body).to match("live")

      expect(first_message.body).to match(current_video_url)

      clear_enqueued_jobs
      WebMock.reset_executed_requests!

      click_stop_broadcast_button
      wait_for_broadcast_state("finished")

      page.refresh

      wait_for_broadcast_state("ready")

      perform_enqueued_jobs

      # Verify it broadcasts when the stream ends
      expect(WebMock).to have_requested(:post, IfThisThenThatJob.post_url).once
    end

    %w[protected private].each do |visibility|
      it "should not send notifications if the stream is private or protected" do
        clear_enqueued_jobs
        WebMock.reset_executed_requests!

        update_video_visibility(visibility)

        click_start_broadcast_button
        wait_for_broadcast_state("live")

        perform_enqueued_jobs

        # Should not say that broadcast started
        expect(WebMock).not_to(have_requested(:post, IfThisThenThatJob.post_url))
        expect(FakeTwilio.messages).to be_blank

        clear_enqueued_jobs
        WebMock.reset_executed_requests!

        click_stop_broadcast_button
        wait_for_broadcast_state("finished")

        perform_enqueued_jobs

        # Should not say that broadcast ended
        expect(WebMock).not_to(have_requested(:post, IfThisThenThatJob.post_url))
      end
    end

    it "should not be able to start a broadcast with a 'starting' state on your video" do
      video.update!(state: "starting")
      previous_path = page.current_path

      # Should just redirect us to a new broadcast like if it was "live""
      page.refresh

      expect(page.current_path).to_not eq(previous_path)
    end

    it "should create a snapshot initially and every 30 seconds" do
      expect(streamer.video_snapshots.count).to eq(0)
      click_start_broadcast_button
      wait_for_broadcast_state("live")

      # IPC rendered only screenshots the camera
      expect(streamer.video_snapshots.count).to eq(1)
    end
  end

  describe "while live streaming" do
    before :each do
      click_start_broadcast_button
      # For most of these, it's important we wait until we are actually "live"
      # and things like the WS connection are open
      wait_for_broadcast_state("live")
    end

    it "should allow you to stop broadcasting" do
      click_stop_broadcast_button
      expect(page).to have_content("Broadcast Complete")
    end

    it "should show failed ffmpeg states" do
      page.execute_script("globalThis.ipcRenderer.simulateFfmpegFailedEvent()")
      page.accept_alert
      expect(page).to have_content("Connection Error")
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
        expect(video.browser_navigations.published).to be_any

        visit channel_path(channel)
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

        expect(find(".message--left")).to have_content(first_message.text, wait: 10)
        expect(page).to_not have_content(second_message_text)
        expect(page).to have_content(first_message.user.display_name)

        someone_chatted(second_message_text)

        expect(page).to have_content(first_message.text, wait: 10)
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

    describe "update title and visibility feature" do
      before :each do
        # Open up the form
        find("#settings-btn").click
        expect(page).to have_css(settings_form)
      end

      it "updates the broadcast title and visibility on button click" do
        new_title = "super cool new title"
        new_visibility = "protected"

        expect(video.title).not_to(eq(new_title))
        expect(video.visibility).not_to(eq(new_visibility))

        within(settings_form) do
          fill_in("video_title", with: new_title)
          find("[value='#{new_visibility}']").select_option
          click_button("Update")
        end

        expect(page).to have_css(".flash-success")

        video.reload
        expect(video.title).to eq(new_title)
        expect(video.visibility).to eq(new_visibility)
      end

      it "properly displays flash message on save" do
        new_title = "*" * 65
        within(settings_form) do
          fill_in("video_title", with: new_title)
          click_button("Update")
        end

        expect(page).to have_css(".flash-error")
      end
    end
  end
end
