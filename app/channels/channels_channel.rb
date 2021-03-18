# frozen_string_literal: true

class ChannelsChannel < ApplicationCable::Channel
  def subscribed
    chan = Channel.friendly.find(params[:room])
    stream_for(chan)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
