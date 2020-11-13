# frozen_string_literal: true

class VideoView < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :video, counter_cache: true
  belongs_to :user_joined_event, optional: true, dependent: :destroy
  after_create :process_user_joined_event

  # Only 1 user allowed to view per video
  validates :user_id,
            uniqueness: {
              allow_nil: true,
              scope: :video_id,
            }

  # # If its a "NULL" user, only 1 set of unique details allowed.
  validates :details,
            if: -> { user_id.nil? },
            uniqueness: {scope: :video_id}

  def self.process_view!(video, user, request)
    video_view = video.video_views.build(
      user: user,
      details: {
        ip_address: request.remote_ip,
        browser: request.user_agent,
      },
    )
    video_view.save! if video_view.valid?
  end

  def process_user_joined_event
    create_user_joined_event(video: video, user: user) if user
  end
end
