# frozen_string_literal: true

require "rails_helper"

RSpec.describe Broadcasts::EventController do
  let(:live_video) { create(:live_video) }

  good_params = {
    input: {
      width: 100,
      height: 100,
      sections: [
        {
          priority: 1,
          type: "webcam",
          height: 90,
          width: 100,
          x: 0,
          y: 0,
        },
      ],
    },
    timecodeMs: 10,
  }

  describe "layout changes" do
    it "is blocked on a non-live video" do
      video = create(:vod_video, state: "finished")
      login_as video.user

      post broadcast_layout_url(video),
           params: good_params,
           as: :json
      expect(JSON.parse(response.body).symbolize_keys).to include({success: false})
      expect(video.video_layout_events.published.count).to eq(1)
    end

    it "must be your own damn video!" do
      random_user = create(:user)
      login_as random_user

      post broadcast_layout_url(live_video, params: good_params, as: :json)
      expect(JSON.parse(response.body).symbolize_keys).to include({success: false})
      expect(live_video.video_layout_events.published.count).to eq(1)
    end

    it "should work" do
      login_as live_video.user

      post broadcast_layout_url(live_video, params: good_params, as: :json)
      expect(JSON.parse(response.body).symbolize_keys).to include({success: true})

      layout_events = live_video.video_layout_events.published
      expect(layout_events.count).to eq(2)
      expect(layout_events.last).to have_attributes(timecode_ms: 10)
      expect(layout_events.last.payload["width"]).to eq(100)
      expect(layout_events.last.payload["sections"].first["x"]).to eq(0)
      expect(layout_events.last.payload["sections"].first["height"]).to eq(90)
    end
  end
end
