# frozen_string_literal: true

class Pin < ApplicationRecord
  belongs_to :video
  belongs_to :pin_event

  def self.process_create(video, timecode_ms, url, name, thumbnail)
    pin = video.pins.create!(
      url: url,
      name: name,
      timecode_ms: timecode_ms,
      thumbnail: thumbnail,
    )

    pin.create_pin_event(video: video, timecode_ms: timecode_ms)

    pin
  end
end
