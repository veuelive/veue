# frozen_string_literal: true

class MuxAssetWebhook < MuxWebhook
  def mux_asset
    mux_target
  end

  def process_created_event!
    mux_live_stream = MuxLiveStream.find_by_mux_id(payload["live_stream_id"])
    video = Video.create!(
      user: mux_live_stream.user,
      mux_live_stream: mux_live_stream,
    )
    mux_asset.update(video: video)
  end

  def process_live_stream_completed_event!
    video = mux_asset.video
    video.mux_playback_id = mux_target.mux_playback_id
    video.finish!
  end
end
