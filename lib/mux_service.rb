# frozen_string_literal: true

class MuxService
  def initialize
    @live_api = MuxRuby::LiveStreamsApi.new
  end

  def create_live_stream
    create_asset_request = MuxRuby::CreateAssetRequest.new
    create_asset_request.per_title_encode = true
    create_asset_request.playback_policy = [MuxRuby::PlaybackPolicy::PUBLIC]
    create_live_stream_request = MuxRuby::CreateLiveStreamRequest.new
    create_live_stream_request.new_asset_settings = create_asset_request
    create_live_stream_request.playback_policy = [MuxRuby::PlaybackPolicy::PUBLIC]
    create_live_stream_request.reduced_latency = true

    @live_api.create_live_stream(create_live_stream_request)
  end

  def destroy_live_stream(live_stream_id)
    @live_api.delete_live_stream(live_stream_id)
  end
end
