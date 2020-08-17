# frozen_string_literal: true

class ChatRoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from("chat_room")
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
