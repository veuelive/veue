# frozen_string_literal: true

class MuxAssetWebhook < MuxWebhook
  def process_live_stream_completed_event!
    video = mux_target&.video
    video.playback_url = MUX_SERVICE.url_for_playback_id(self.mux_target.playback_id)
    video.finish!
  end
end
