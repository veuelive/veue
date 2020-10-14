# frozen_string_literal: true

require "rails_helper"

describe LiveVideoChannel, type: :channel do
  let(:video) { create(:video) }

  before do
    stub_connection video_id: video.to_param
  end

  describe "live_video channel subscription" do
    it "subscribes to a stream with video_id provided" do
      subscribe(videoId: video.to_param)
      video.reload

      expect(subscription).to be_confirmed
      expect(subscription).to have_stream_from("live_video_#{video.to_param}")
    end
  end

  describe "broadcast to active_viewers" do
    before do
      video.go_live!
    end

    it "should broadcast incremented active_viewers count" do
      expect { subscribe(videoId: video.to_param) }.to(
        have_broadcasted_to("active_viewers_#{video.to_param}").with(
          viewers: video.active_viewers + 1,
        ),
      )
    end

    it "should broadcast decremented active_viewers count" do
      subscribe(videoId: video.to_param)

      expect { unsubscribe }.to(
        have_broadcasted_to("active_viewers_#{video.to_param}").with(
          viewers: video.active_viewers,
        ),
      )
    end
  end
end
