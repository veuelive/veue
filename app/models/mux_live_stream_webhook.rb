# frozen_string_literal: true

class MuxLiveStreamWebhook < MuxWebhook
  def process_recording_event!
    mux_target.videos.pending.first.update(mux_playback_id: get_playback_id)
  end

  def process_active_event!
    video = mux_target.videos.pending.first
    video.go_live! if video.may_go_live?
  end
end
