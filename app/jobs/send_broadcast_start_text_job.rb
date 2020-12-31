# frozen_string_literal: true

class SendBroadcastStartTextJob < ApplicationJob
  queue_as :default

  def perform(channel, followers: nil, batch_size: 1000)
    # Create a batch queue if followers arent passed.
    if followers.nil?
      queue_in_batches(channel, batch_size: batch_size)
      return
    end

    followers.each do |follower|
      SmsMessage.notify_broadcast_start!(channel: channel, follower: follower)
    end
  end

  private

  def queue_in_batches(channel, batch_size:)
    channel.followers.find_in_batches(batch_size: batch_size) do |followers|
      SendBroadcastStartTextJob.perform_later(channel, followers: followers)
    end
  end
end
