# frozen_string_literal: true

require "rails_helper"

RSpec.describe MuxRuby::LiveStream, type: :model do
  context "talking with Mux service" do
    before do
      @mux_service = double(MUX_SERVICE)
      stub_const("MUX_SERVICE", @mux_service)
      @user = create(:user)
    end

    it "should be able to #setup_as_streamer!" do
      expect(@user.mux_live_stream_id).to be_nil

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

      expect(@user.mux_live_stream_id).to eq(mux_ruby_live_stream.id)
    end
  end
end
