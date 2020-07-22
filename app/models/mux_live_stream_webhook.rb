# frozen_string_literal: true

class MuxLiveStreamWebhook < MuxWebhook

  def process_recording_event!
    mux_target.ensure_video_exists!
    mux_target.video.mux_assets.create!(
      mux_id: payload["active_asset_id"],
      user: mux_target.video.user,
    )
    mux_target.video.go_live! if mux_target.video.may_go_live?
  end

  def process_idle_event!
    mux_target.video.pause! if mux_target.video&.may_pause?
  end

  alias :process_disconnect_event! :process_idle_event!
end
