# frozen_string_literal: true

class VideoEvent < ApplicationRecord
  belongs_to :user
  belongs_to :video
  has_many :moderation_items, dependent: :nullify

  before_save :set_payload
  before_create :set_timecode
  before_create :set_published_state
  after_commit :broadcast_message!, on: :create

  validates :video, presence: true
  validates :input, json: {schema: -> { input_schema.to_json }}
  validates :payload, presence: true, unless: :new_record?

  scope :published, -> { where(published: true) }
  scope :unpublished, -> { where(published: false) }

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
    return unless published || video.finished?

    message = build_message

    GripBroadcaster.send_message(
      video.channel.id,
      id,
      message,
    )
  end

  def build_message
    message = to_hash
    message[:timecodeMs] = 0 if instant_broadcast_processing?
    message[:viewers] = video.video_views.connected.count
    message
  end

  def to_hash
    {
      type: type,
      timecodeMs: timecode_ms,
      data: payload.merge({id: id}),
    }
  end

  # Override this if you want different logic for publishing
  def set_published_state
    self.published = true
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
