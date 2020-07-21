# frozen_string_literal: true

class MuxLiveStreamWebhook < MuxWebhook
  # This method is called AFTER we've been inserted into the database
  # and is processed after we respond to the webhook... here is where
  # you do the real work!
  def process!
    mux_live_stream = mux_target

    # Override the status of the live stream with the status we get from this update
    # This is assuming we process these in order and that's most likely a mistake
    # but I'm not sure how to ensure ordering at the moment.
    mux_live_stream.state = payload["status"]

    process_event(mux_live_stream)

    mux_live_stream.save!
  end

  private

  def process_event(mux_live_stream)
    logger.debug("Processing Event #{event}")
    logger.debug(payload.inspect)
    case event_name
    when "active", "connected", "recording"
      stream_is_live(mux_live_stream)
    when "disconnected", "idle"
      stream_is_offline(mux_live_stream)
    else
      logger.debug "Unhandled MuxLiveStreamWebhook event #{event}"
    end
  end

  def stream_is_offline(mux_live_stream)
    mux_live_stream.video.pause! if mux_live_stream.video&.may_pause?
  end

  def stream_is_live(mux_live_stream)
    video = mux_live_stream.ensure_video_exists!
    video.go_live! if video.may_go_live?
    playback = payload["playback_ids"].find { |playback| playback["policy"] == "public" }
    video.update!(playback_url: playback["id"]) if playback
  end
end
