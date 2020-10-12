# frozen_string_literal: true

require "rails_helper"

# ATTENTION: This file uses a lot of the files in the 'webhooks' folder to simulate the Mux service
# talking to our service

RSpec.describe "MuxWebhooks" do
  include ActiveJob::TestHelper

  before :example do
    @webhook_idx = 0
    @live_stream_id = mux_webhooks[0]["data"]["id"]
    @user = create(:streamer, {mux_live_stream_id: @live_stream_id})

    # Videos are created BEFORE Mux gets involved
    @video = @user.active_video!
  end

  def skip_ahead_to_next!(event_name)
    loop do
      next_webhook!
      break if event_name == @last_webhook["type"]
    end
  end

  def next_webhook!(event_name=nil)
    @last_webhook = mux_webhooks[@webhook_idx]
    expect(@last_webhook["type"]).to eq(event_name) if event_name
    perform_enqueued_jobs do
      response_code = post "/mux/webhook", params: @last_webhook, as: :json
      expect(response_code).to be(200)
    end
    @webhook_idx += 1
    @last_webhook
  end

  it "should update some fields on every webhook" do
    next_webhook!("video.live_stream.created")
    expect(MuxWebhook.count).to eq(1)
  end

  it "should never process webhooks twice!" do
    expect(MuxWebhook.count).to eq(0)
    next_webhook!("video.live_stream.created")
    expect(MuxWebhook.count).to eq(1)
    @webhook_idx -= 1
    perform_enqueued_jobs do
      MuxWebhookJob.perform_now MuxWebhook.first
    end
  end

  context "start a stream!" do
    it "should connect to video" do
      expect(Video.count).to eq(1)
      skip_ahead_to_next!("video.live_stream.active")
      webhook = MuxWebhook.last
      expect(Video.count).to eq(1)
      video = Video.first
      expect(video.mux_playback_id).to eq(webhook.playback_id)
      expect(video.started_at_ms).to_not be_nil
      expect(video).to be_live
      webhook.reload
      expect(webhook.user).to eq(@user)
      expect(webhook.video).to eq(video)
    end

    it "should use the live playback_id while live" do
      skip_ahead_to_next!("video.live_stream.active")
      expect(Video.first.mux_playback_id).to eq("gnpT00lBULFoSVZ7almAtgEr5KWDkoMVm7Wmud01yZd02Q")
    end
  end

  context "a stream is ending" do
    before :example do
      skip_ahead_to_next!("video.asset.live_stream_completed")
    end

    it "should transition the video" do
      expect(Video.first).to be_finished
      expect(Video.first.duration).to_not eq(nil)
      expect(Video.count).to eq(1)
    end

    it "should use the asset playback_id" do
      expect(Video.first.mux_playback_id).to eq("rqNernfGonhdV9nLpBmyn100ynaoQoBTUzAOxUDNtHUo")
    end
  end

  context "we have two videos in total!" do
    it "should create two videos" do
      skip_ahead_to_next!("video.asset.live_stream_completed")
      skip_ahead_to_next!("video.live_stream.active")
      # So this would be into the second stream now
      expect(Video.count).to eq(2)
      expect(Video.live.count).to eq(1)
      expect(Video.finished.count).to eq(1)
    end
  end
end
