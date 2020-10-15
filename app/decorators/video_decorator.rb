# frozen_string_literal: true

class VideoDecorator < Draper::Decorator
  include ActionView::Helpers::NumberHelper

  delegate_all

  def thumbnail_url
    "https://image.mux.com/#{object.mux_playback_id}/thumbnail.png"
  end

  def stream_type
    state == "live" ? "live" : "vod"
  end

  def active_viewers_count
    number_to_human(active_viewers, format: "%n%u", units: {thousand: "K", million: "M", billion: "B"})
  end
end
