# frozen_string_literal: true

require "system_helper"

# NOTE: These tests are trying to test a sequence that doesn't NORMALLY happen just
# within the rails app. This has to be combined with the real Electron App to get full / perfect results.
describe "Broadcast View" do
  include BroadcastSystemHelpers
  # These are useful for chat messages
  include AudienceSpecHelpers

  let(:streamer) { create(:streamer) }
  let(:channel) { streamer.channels.first }
  let(:video) { channel.active_video }

  before :example do
    driven_by :media_browser
    resize_window_desktop
  end

  before :each do
    login_as(streamer)
    visit "/broadcasts"

    shift_to_broadcast_view

    find("body").click

    ensure_live_event_source
  end

  it "should load for a setup streamer" do
    wait_for_broadcast_state("ready")

    click_start_broadcast_button

    expect(page).to have_css("div[data-broadcast-state='live']", wait: 10)

    expect(page).to have_css("div[data-broadcast-started-at]")

    expect(page).to have_css(".stop-btn")
    wait_for_broadcast_state("live")

    expect(Video.last.started_at_ms).to_not be_nil

    expect_no_javascript_errors
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
      wait_for_broadcast_state("live")

      server = Capybara.current_session.server
      current_video_url = channel_path(channel, host: server.host, port: server.port)

      # Check that we attempt to attach initial snapshots
      expect(video).to receive(:attach_initial_shots!).once

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
      shift_to_broadcast_view

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

        # Check that we attempt to attach initial snapshots
        expect(video).to receive(:attach_initial_shots!).once

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
      # expect(streamer.video_snapshots.count).to eq(1)
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

    describe "reload page" do
      it "should load with new video" do
        # Refreshing view while broadcasting live video
        page.refresh
        shift_to_broadcast_view

        expect(find("#broadcast")["data-broadcast-video-state"]).to eq("pending")
      end
    end

    describe "chat message events" do
      it "should display live messages on broadcaster view" do
        first_message = someone_chatted
        second_message_text = "Cowabunga!"

        expect(video.chat_messages.count).to eq(1)

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
        expect(page).to have_content("Pizza time!", wait: 10).once

        accept_confirm do
          # Secondary test, skipping a lot of the setup
          # IT should end the broadcast when there is a full connection failure
          execute_script("document.dispatchEvent(new CustomEvent('StreamDisconnectErrorEvent'))")
        end

        shift_to_broadcast_view

        expect(page).to have_content("Go Live")
        expect(page).to_not have_content("Cowabunga!")
      end
    end
  end

  describe "update title and visibility feature" do
    it "updates the broadcast title and visibility on button click" do
      new_title = "super cool new title"
      new_visibility = "protected"
      expect(video.title).not_to(eq(new_title))
      expect(video.visibility).not_to(eq(new_visibility))

      fill_in("video_title", with: "")
      fill_in("video_title", with: new_title)
      find("[value='#{new_visibility}']").select_option

      expect(page).to have_css("svg.loading")
      expect(page).to have_css(".notification-wrapper", wait: 5)

      video.reload
      expect(video.title).to eq(new_title)
      expect(video.visibility).to eq(new_visibility)
    end
  end

  describe "broadcast foreground warning" do
    it "should be present on load and can be dismissed" do
      expect(page).to have_content(I18n.t("broadcast.foreground_warning"))

      find(".broadcast-warning__btn").click
      expect(page).to_not have_content(I18n.t("broadcast.foreground_warning"))
    end

    it "should be dismissed after sometime" do
      expect(page).to have_content(I18n.t("broadcast.foreground_warning"))
      expect(page).to_not have_content(I18n.t("broadcast.foreground_warning"), wait: 20)
    end
  end
end
