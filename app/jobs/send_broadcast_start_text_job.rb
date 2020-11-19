# frozen_string_literal: true

class SendBroadcastStartTextJob < ApplicationJob
  queue_as :default

  def perform(streamer:, video_url:, followers: nil, batch_size: 1000)
    # Create a batch queue if followers arent passed.
    if followers.nil?
      SendBroadcastStartTextJob.queue_in_batches(streamer: streamer,
                                                 video_url: video_url,
                                                 batch_size: batch_size)
    else
      followers.each do |follower|
        SmsMessage.notify_broadcast_start!(streamer: streamer,
                                           video_url: video_url,
                                           follower: follower)
      end
    end
  end

  def self.queue_in_batches(streamer:, video_url:, batch_size:)
    streamer.followers.find_in_batches(batch_size: batch_size) do |followers|
      SendBroadcastStartTextJob.perform_later(
        streamer: streamer,
        video_url: video_url,
        followers: followers,
      )
    end
  end
end
