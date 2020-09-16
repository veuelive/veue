# frozen_string_literal: true

class User < ApplicationRecord
  has_many :videos, dependent: :destroy
  has_many :mux_live_streams, dependent: :nullify
  belongs_to :mux_live_stream, optional: true
  delegate :stream_key, to: :mux_live_stream
  has_many :chat_messages, dependent: :destroy
  has_many :session_tokens, dependent: :nullify

  validates :display_name, length: {maximum: 40, minimum: 1}, presence: true
  validates :phone_number, phone_number: true

  encrypts :phone_number
  blind_index :phone_number

  def setup_as_streamer!
    return if mux_live_stream

    stream_object = MuxLiveStream.create!(user: self)
    update!({
              mux_live_stream: stream_object,
            })
  end
end
