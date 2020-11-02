# frozen_string_literal: true

class MuxService
  def initialize
    @live_api = MuxRuby::LiveStreamsApi.new
    @asset_api = MuxRuby::AssetsApi.new
  end

  def create_live_stream
    create_asset_request = MuxRuby::CreateAssetRequest.new
    create_asset_request.per_title_encode = true
    create_asset_request.playback_policy = [MuxRuby::PlaybackPolicy::PUBLIC]
    create_live_stream_request = MuxRuby::CreateLiveStreamRequest.new
    create_live_stream_request.new_asset_settings = create_asset_request
    create_live_stream_request.playback_policy = [MuxRuby::PlaybackPolicy::PUBLIC]
    create_live_stream_request.reduced_latency = true

    begin
      @live_api.create_live_stream(create_live_stream_request)
    rescue MuxRuby::UnauthorizedError => e
      throw(`#{e} Double check the MUX ID and SECRET in application.yml;
 if that doesn't work, revoke & re-issue on Mux, change config & restart your app`)
    end
  end

  def destroy_live_stream(live_stream_id)
    @live_api.delete_live_stream(live_stream_id)
  end

  def destroy_asset(asset_id)
    @asset_api.delete_asset(asset_id)
  end

  def url_for_playback_id(playback_id)
    "https://stream.mux.com/#{playback_id}.m3u8"
  end
end
