# frozen_string_literal: true

class VideoEvent < ApplicationRecord
  belongs_to :user
  belongs_to :video

  before_save :set_payload
  after_create :broadcast_message

  validates :video, presence: true
  validates :input, presence: true, json: {schema: -> { input_schema.to_json }}
  validates :payload, presence: true, unless: :new_record?

  def set_payload
    self.payload = input_to_payload
  end

  def broadcast_message
    ActionCable.server.broadcast(
      "live_video_#{video.to_param}",
      {
        timecode_ms: timecode_ms,
        payload: payload,
      },
    )
  end
end
