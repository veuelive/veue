# frozen_string_literal: true

class VideoEvent < ApplicationRecord
  belongs_to :user
  belongs_to :video

  before_save :set_payload
  before_create :set_timecode
  after_create :broadcast_message!

  validates :video, presence: true
  validates :input, json: {schema: -> { input_schema.to_json }}
  validates :payload, presence: true, unless: :new_record?

  def set_payload
    self.payload = input_to_payload
  end

  # For "live" events like Chat, that need to happen relative to
  # the ACTUAL timecode that the streamer is using and should be instant during live
  # the client won't/can't give us a timecode, so we will see how long it's been since
  # the video started and use that as our timecode
  def set_timecode
    return if timecode_ms
    (self.timecode_ms = 0) && return unless video.started_at_ms

    self.timecode_ms = Time.now.utc.to_ms - video.started_at_ms
  end

  def broadcast_message!
    message = to_hash
    message[:timecodeMs] = 0 if instant_broadcast_processing?
    message[:viewers] = video.video_views.connected.count
    SseBroadcaster.broadcast(
      video.channel.id,
      message,
    )
  end

  def to_hash
    {
      type: type,
      timecodeMs: timecode_ms,
      data: payload,
    }
  end

  # This should be overridden if the message
  # should be immediately processed on the client
  def instant_broadcast_processing?
    false
  end

  def input_schema
    {properties: {}}
  end
end
