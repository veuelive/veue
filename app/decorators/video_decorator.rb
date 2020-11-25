# frozen_string_literal: true

class VideoDecorator < Draper::Decorator
  include ActionView::Helpers::NumberHelper

  delegate_all

  def thumbnail_url
    "https://image.mux.com/#{object.mux_playback_id}/thumbnail.png"
  end

  def stream_type
    case state
    when "live"
      "live"
    when "pending", "starting"
      "upcoming"
    else
      "vod"
    end
  end

  def active_viewers_count
    number_to_human(
      video.video_views.connected.count,
      format: "%n%u",
      units: {thousand: "K", million: "M", billion: "B"},
    )
  end

  def display_state
    case state
    when "live"
      "LIVE"
    when "finished"
      "REPLAY"
    else
      "UPCOMING"
    end
  end
end
