# frozen_string_literal: true

class MuxAssetWebhook < MuxWebhook
  def process_live_stream_completed_event!
    video = mux_target.video
    video.mux_playback_id = mux_target.mux_playback_id
    video.finish!
  end
end
