# frozen_string_literal: true

class LiveVideoChannel < ApplicationCable::Channel
  def subscribed
    stream_from(stream_name)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private

  def stream_name
    "live_video_#{video_id}"
  end

  def video_id
    params.fetch('roomId')
  end
end
