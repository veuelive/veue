# frozen_string_literal: true

require "rails_helper"

RSpec.describe Broadcasts::EventController do
  let(:live_video) { create(:live_video) }

  good_params = {
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
    timecode: {
      width: 100,
      height: 200,
      digits: 10,
      x: 0,
      y: 90,
    },
    timecodeMs: 10,
  }

  describe "layout changes" do
    it "is blocked on a non-live video" do
      video = create(:video, state: "finished")
      login_as video.user

      post broadcast_layout_url(video),
           params: good_params,
           as: :json
      expect(JSON.parse(response.body).symbolize_keys).to include({success: false})
      expect(video.video_layout_events.count).to eq(0)
    end

    it "must be your own damn video!" do
      random_user = create(:user)
      login_as random_user

      post broadcast_layout_url(live_video, params: good_params, as: :json)
      expect(JSON.parse(response.body).symbolize_keys).to include({success: false})
      expect(live_video.video_layout_events.count).to eq(0)
    end

    it "should work" do
      login_as live_video.user

      post broadcast_layout_url(live_video, params: good_params, as: :json)
      expect(JSON.parse(response.body).symbolize_keys).to include({success: true})
      expect(live_video.video_layout_events.count).to eq(1)
      expect(live_video.video_layout_events.first).to have_attributes(timecode_ms: 10)
      expect(live_video.video_layout_events.first.payload["width"]).to eq(100)
      expect(live_video.video_layout_events.first.payload["sections"].first["x"]).to eq(0)
      expect(live_video.video_layout_events.first.payload["sections"].first["height"]).to eq(90)
    end
  end
end
