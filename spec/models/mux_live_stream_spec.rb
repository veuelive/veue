# frozen_string_literal: true

require "rails_helper"

RSpec.describe MuxLiveStream, type: :model do
  context "talking with Mux service" do
    before do
      @mux_service = double(MUX_SERVICE)
      stub_const("MUX_SERVICE", @mux_service)
      @user = create(:user)
    end

    it "should be able to #setup_as_streamer!" do
      expect(@user.mux_live_streams.count).to eq(0)

      # Grab the first webhook... we'll use this to pass the right data into
      # mocking the service for creating
      create_webhook = mux_webhooks.first
      expect(create_webhook["type"]).to eq("video.live_stream.created")

      # This is a little tricky as the above webhook won't have fired yet...
      # but the data is the same so we're exploiting that here to make a test!
      mux_ruby_live_stream = MuxRuby::LiveStream.new(create_webhook["data"])
      mux_ruby_live_stream.playback_ids.map! { |playback_data| MuxRuby::PlaybackID.new(playback_data) }
      mux_response = MuxRuby::LiveStreamResponse.new(data: mux_ruby_live_stream)

      expect(@mux_service).to receive(:create_live_stream).and_return(mux_response)
      # Okay, let's do it!
      @user.setup_as_streamer!

      expect(@user.mux_live_streams.count).to eq(1)

      live_stream = @user.mux_live_streams.first

      # This is actually the only thing that REALLY matters when we create
      # the new MuxLiveStream model... we _have_ to have the right Mux id!
      expect(live_stream.mux_id).to eq(create_webhook["data"]["id"])
    end
  end
end
