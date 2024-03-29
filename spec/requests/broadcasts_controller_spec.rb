# frozen_string_literal: true

require "rails_helper"

describe BroadcastsController do
  include ActiveSupport::Testing::TimeHelpers
  let(:user) { create(:user) }
  let(:channel) { user.channels.first }
  let(:video) { channel.videos.first }

  before(:each) do
    login_as user
    get broadcasts_path
  end

  describe "before broadcast" do
    it "should have an app configuration set" do
      expect(response.body).to match(/"env":"test"/im)
    end
  end

  describe "starting up" do
    it "should start" do
      video_layout_payload = {
        width: 1280,
        height: 1080,
        sections: [
          {type: "screen", priority: 1, width: 1200, height: 740, x: 0, y: 0},
          {type: "camera", priority: 2, width: 420, height: 340, y: 740, x: 0},
        ],
      }.to_json

      post(start_broadcast_path(video), params: {url: "https://apple.com", video_layout: video_layout_payload})

      video = Video.last
      expect(video.started_at_ms).to_not be_nil
      layout_events = video.video_layout_events.published
      expect(layout_events.count).to eq(1)
      expect(layout_events.last.payload).to eq(JSON.parse(video_layout_payload))
    end
  end

  describe "should allow keepalive updates" do
    it "should update the updated_at and avoid staleness" do
      original_updated_at = video.updated_at
      expect(Video.stale.count).to eq(0)

      travel 1.day
      expect(Video.stale.count).to eq(1)

      post keepalive_broadcast_path(video)
      video.reload
      expect(video.updated_at).to be > original_updated_at
      expect(Video.stale.count).to eq(0)

      # And another day in advance...
      travel 1.day
      expect(Video.stale.count).to eq(1)
    end
  end

  describe "update video" do
    it "should not update when title has more than 60 characters" do
      put broadcast_path(video, params: {video: {title: Faker::Lorem.characters(number: 70)}})
      error_message = "Title is too long (maximum is 60 characters)"
      expect(JSON.parse(response.body)).to eq([error_message])
      expect(response).to have_http_status(422)
    end
  end
end
