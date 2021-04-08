# frozen_string_literal: true

class VideoSnapshot < ApplicationRecord
  belongs_to :video

  has_one_attached :image

  scope :future_snapshots, ->(timecode) { where("timecode >= ?", timecode) }
  scope :past_snapshots, ->(timecode) { where("timecode < ?", timecode) }
  scope :priority, ->(number) { where(priority: number) }

  def self.find_all_between(min:, max:)
    future_snapshots(min)
      .past_snapshots(max)
      .order(timecode: :asc, priority: :asc)
  end
end
