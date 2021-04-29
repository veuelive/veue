# frozen_string_literal: true

class VideoSnapshot < ApplicationRecord
  belongs_to :video

  validates :priority, numericality: {only_integer: true, greater_than_or_equal_to: 1}
  validates :timecode, numericality: {only_integer: true, greater_than_or_equal_to: -1}

  has_one_attached :image

  scope :future_snapshots, ->(timecode) { where("timecode >= ?", timecode) }
  scope :past_snapshots, ->(timecode) { where("timecode < ?", timecode) }
  scope :priority, ->(number) { where(priority: number) }

  def self.find_all_between(min:, max:)
    future_snapshots(min)
      .past_snapshots(max)
      .order(timecode: :asc, priority: :asc)
  end

  # Give a half second buffer for screenshots (30_000 is actual interval)
  # This is used for positive look ahead and negative look behind
  def self.find_at_timecode(timecode, interval: 29_500)
    # Timecodes are given as 1, 2, 3, etc
    timecode *= 30_000

    min = timecode - interval
    max = timecode + interval
    find_all_between(min: min, max: max).first
  end

  def primary_shot?(video)
    image.blob == video.primary_shot.blob
  end

  def secondary_shot?(video)
    image.blob == video.secondary_shot.blob
  end

  def preview_url
    Router.url_for(image.variant(resize_to_limit: [200, 112]))
  end
end
