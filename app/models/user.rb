# frozen_string_literal: true

class User < ApplicationRecord
  has_many :videos, dependent: :destroy
  has_many :mux_live_streams, dependent: :nullify
  belongs_to :mux_live_stream, optional: true
  delegate :stream_key, to: :mux_live_stream
  has_many :chat_messages, dependent: :destroy
  has_many :user_login_attempts, dependent: :nullify

  validates :display_name, length: {maximum: 40, minimum: 1}, presence: true
  validates :phone_number, phone_number: true

  encrypts :phone_number
  blind_index :phone_number

  aasm column: :state do
    state :user, initial: true
    state :streamer
    state :admin

    event :make_streamer do
      transitions from: :user, to: :streamer, guard: :valid_username?
    end
  end

  def valid_username?
    username =~ /[A-z0-9_\\-]+/
  end

  def setup_as_streamer!
    make_streamer
    stream_object = MuxLiveStream.create!(user: self)
    update!({
              mux_live_stream: stream_object,
            })
  end
end
