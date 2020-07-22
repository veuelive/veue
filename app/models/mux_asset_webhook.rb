# frozen_string_literal: true

class MuxAssetWebhook < MuxWebhook
  def process_live_stream_completed_event!
    mux_target.video.finish!
  end

  def process_ready
    mux_target.video.asset_ready
  end
end
