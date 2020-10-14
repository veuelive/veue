# frozen_string_literal: true

class Pin < ApplicationRecord
  belongs_to :video
  belongs_to :pin_event
  has_one_attached :thumbnail

  def self.process_create(video, timecode_ms, url, name, thumbnail)
    pin = video.pins.build(
      url: url,
      name: name,
      timecode_ms: timecode_ms,
      thumbnail: thumbnail,
    )
    pin.build_pin_event(video: video, timecode_ms: timecode_ms, input: {})
    pin.save!
    pin
  end
end
