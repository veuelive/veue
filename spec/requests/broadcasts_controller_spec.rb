# frozen_string_literal: true

require "rails_helper"

describe BroadcastsController do
  let(:user) { create(:user) }
  let(:channel) { user.channels.first }
  let(:video) { channel.videos.first }

  before(:each) do
    login_as user
    get broadcasts_path
    follow_redirect!
  end

  describe "before broadcast" do
    it "should include the stream key!" do
      get broadcasts_path
      follow_redirect!

      stream_key = user.channels.first.mux_stream_key
      expect(stream_key).to have_attributes(size: (be > 2))
      expect(response.body).to include(stream_key)
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
        timecode: {digits: 12, width: 360, height: 10, y: 1070, x: 920},
      }.to_json

      post(start_broadcast_path(video), params: {url: "https://apple.com", video_layout: video_layout_payload})

      video = Video.last
      expect(video.started_at_ms).to_not be_nil
      expect(video.video_layout_events.count).to eq(1)
      expect(video.video_layout_events.last.payload).to eq(JSON.parse(video_layout_payload))
    end
  end

  describe "during broadcast" do
    it "should create page views" do
      pdp_page = "https://abracadabranyc.com/collections/magic/products/fire-wallet-by-premium-magic"

      post navigation_update_broadcast_path(id: video.to_param),
           as: :json,
           params: {
             url: pdp_page,
             canGoBack: false,
             canGoForward: true,
             isLoading: false,
             timecodeMs: 100,
           }

      # No content sent!
      expect(response.status).to eq(204)

      video.reload
      expect(video.video_events).to_not be_empty
      page_visit = video.browser_navigations.last
      expect(page_visit.payload["url"]).to eq(pdp_page)
      expect(page_visit.timecode_ms).to eq(100)
    end
  end
end
