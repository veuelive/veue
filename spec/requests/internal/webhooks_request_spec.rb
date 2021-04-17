# frozen_string_literal: true

require "rails_helper"

describe Internal::WebhooksController do
  describe "ending a video" do
    let(:video) { create(:live_video) }
    let(:duration) { 1337.894 }
    let(:end_reason) { "video stopped" }
    let(:end_payload) {
      {
        what: "ended",
        data: {
          tags: %W[webhookHost:sushitown.com videoId:#{video.id}],
          reason: end_reason,
          duration: duration,
          uri: "vod.m3u8",
        },
      }
    }

    it "should end a video" do
      post "/_/_/phenix", as: :json, params: end_payload
      expect(video.reload.duration).to eq((duration / 1_000).ceil)
      expect(video.end_reason).to eq(end_reason)
      expect(video).to be_ended
    end

    it "should handle nil durations and end_reasons gracefully" do
      nil_payload = end_payload.deep_dup

      nil_payload[:data][:duration] = nil
      nil_payload[:data][:reason] = nil

      # Lets check to make sure nothing happens with an initial nil_payload
      post "/_/_/phenix", as: :json, params: nil_payload

      expect(video.reload.duration).to be_nil
      expect(video.end_reason).to be_nil
      expect(video).to be_ended

      # This is what we typically expect to happen
      post "/_/_/phenix", as: :json, params: end_payload

      expect(video.reload.duration).to eq((duration / 1_000).ceil)
      expect(video.end_reason).to eq(end_reason)
      expect(video).to be_ended

      # Should not update the video durations and end_reasons with a nil payload
      post "/_/_/phenix", as: :json, params: nil_payload

      expect(video.reload.duration).to eq((duration / 1_000).ceil)
      expect(video.end_reason).to eq(end_reason)
      expect(video).to be_ended
    end
  end
end
