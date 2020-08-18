# frozen_string_literal: true

class ChatRoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from("chat_channel_#{params[:roomId]}")
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private

  def stream_name
    "chat_channel_#{video_id}"
  end

  def video_id
    params.fetch('data').fetch('roomId')
  end
end
