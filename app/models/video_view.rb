# frozen_string_literal: true

class VideoView < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :video, counter_cache: true

  # Only 1 user allowed to view per video
  validates :user_id,
            uniqueness: {
              allow_nil: true,
              scope: :video_id
            }

  # # If its a "NULL" user, only 1 set of unique details allowed.
  validates :details,
            if: -> { user_id.nil? },
            uniqueness: {scope: :video_id}
end
