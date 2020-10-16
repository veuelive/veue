# frozen_string_literal: true

require "rails_helper"

describe BroadcastsController do
  describe "before broadcast" do
    before :each do
      @streamer = create(:streamer)
      login_as @streamer
    end

    it "should include the stream key!" do
      get broadcasts_path
      follow_redirect!

      expect(@streamer.mux_stream_key).to have_attributes(size: (be > 2))
      expect(response.body).to include(@streamer.mux_stream_key)
    end
  end

  describe "during broadcast" do
    let(:video) { create(:live_video) }
    before :each do
      login_as video.user
    end

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

    it "should start" do
      post(start_broadcast_path(video), params: {url: "http://hamptoncatlin.com"})

      expect(Video.last.started_at_ms).to_not be_nil
    end
  end
end
