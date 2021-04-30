# frozen_string_literal: true

class VideoSnapshot < ApplicationRecord
  belongs_to :video

  validates :priority, numericality: {only_integer: true, greater_than_or_equal_to: 1}
  validates :timecode, numericality: {only_integer: true, greater_than_or_equal_to: -1}

  has_one_attached :image do |attachable|
    attachable.variant :preview, resize: "112x200"
  end

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

  # Processed the image variant
  def processed_preview
    image.variant(:preview).processed
  end

  def preview_url
    if Rails.application.config.active_storage.service == :amazon
      # if using S3, use the S3 url directly
      processed_preview.url
    else
      # this is for test / local envs.
      Router.url_for(processed_preview)
    end
  end
end
