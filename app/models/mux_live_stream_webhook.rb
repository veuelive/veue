# frozen_string_literal: true

class MuxLiveStreamWebhook < MuxWebhook
  def process_recording_event!
    video = mux_target.videos.create!(
      user: mux_target.user,
      playback_url: MUX_SERVICE.url_for_playback_id(mux_target.playback_id),
    )
    video.mux_assets.create!(
      mux_id: payload["active_asset_id"],
    )
    video.go_live! if video.may_go_live?
  end
end
