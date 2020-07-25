# frozen_string_literal: true

class VideoDecorator < Draper::Decorator
  delegate_all

  def thumbnail_url
    "https://image.mux.com/#{object.mux_playback_id}/animated.gif"
  end

  # Define presentation-specific methods here. Helpers are accessed through
  # `helpers` (aka `h`). You can override attributes, for example:
  #
  #   def created_at
  #     helpers.content_tag :span, class: 'time' do
  #       object.created_at.strftime("%a %m/%d/%y")
  #     end
  #   end
end
