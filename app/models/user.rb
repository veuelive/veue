# frozen_string_literal: true

class User < ApplicationRecord
  has_many :videos, dependent: :destroy
  has_many :video_events, dependent: :destroy
  has_many :chat_messages, dependent: :destroy
  has_many :session_tokens, dependent: :nullify
  has_many :mux_webhooks, dependent: :destroy
  has_many :user_follows,
           -> { where(unfollowed_at: nil) },
           class_name: :Follow,
           foreign_key: :follower_id,
           inverse_of: :streamer_follow
  has_many :streamer_follows,
           -> { where(unfollowed_at: nil) },
           class_name: :Follow,
           foreign_key: :streamer_id,
           inverse_of: :user_follow
  has_many :followers, through: :streamer_follows, source: :streamer_follow
  has_many :streamers, through: :user_follows, source: :user_follow

  validates :display_name, length: {maximum: 40, minimum: 1}, presence: true
  validates :phone_number, phone_number: true

  encrypts :mux_stream_key
  encrypts :phone_number
  blind_index :phone_number

  def setup_as_streamer!
    return if mux_stream_key

    live_stream_response = MUX_SERVICE.create_live_stream
    data = live_stream_response.data
    self.mux_live_stream_id = data.id
    self.mux_stream_key = data.stream_key
    save!
  end

  def active_video
    videos.active.first
  end

  def active_video!
    videos.active.first || create_new_broadcast!
  end

  def create_new_broadcast!
    setup_as_streamer!
    videos.create!
  end

  def follows?(streamer)
    streamers.include?(streamer)
  end
end
