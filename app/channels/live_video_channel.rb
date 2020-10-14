# frozen_string_literal: true

class LiveVideoChannel < ApplicationCable::Channel
  def subscribed
    current_video.increment_viewers!
    stream_from(stream_name)
  end

  def unsubscribed
    current_video.decrement_viewers! if current_video.active_viewers
    stop_all_streams
  end

  private

  def current_video
    @current_video = Video.find(video_id)
  end

  def stream_name
    "live_video_#{video_id}"
  end

  def video_id
    params.fetch("videoId")
  end
end
