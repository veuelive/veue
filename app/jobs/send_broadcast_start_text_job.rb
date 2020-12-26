# frozen_string_literal: true

class SendBroadcastStartTextJob < ApplicationJob
  queue_as :default

  def perform(channel:, channel_url:, followers: nil, batch_size: 1000)
    # Create a batch queue if followers arent passed.
    if followers.nil?
      SendBroadcastStartTextJob.queue_in_batches(
        channel: channel,
        channel_url: channel_url,
        batch_size: batch_size,
      )
    else
      followers.each do |follower|
        SmsMessage.notify_broadcast_start!(
          channel: channel,
          channel_url: channel_url,
          follower: follower,
        )
      end
    end
  end

  def self.queue_in_batches(channel:, channel_url:, batch_size:)
    channel.followers.find_in_batches(batch_size: batch_size) do |followers|
      SendBroadcastStartTextJob.perform_later(
        channel: channel,
        channel_url: channel_url,
        followers: followers,
      )
    end
  end
end
