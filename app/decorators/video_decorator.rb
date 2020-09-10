# frozen_string_literal: true

class VideoDecorator < Draper::Decorator
  delegate_all

  def thumbnail_url
    "https://image.mux.com/#{object.mux_playback_id}/thumbnail.png"
  end
end
