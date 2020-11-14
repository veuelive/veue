# frozen_string_literal: true

class LiveAudienceChannel < ApplicationCable::Channel
  def subscribed
    stream_from(stream_name)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private

  def stream_name
    "live_audience_#{video_id}"
  end

  def video_id
    params.fetch("videoId")
  end
end
