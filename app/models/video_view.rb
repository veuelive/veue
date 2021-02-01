# frozen_string_literal: true

class VideoView < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :video, counter_cache: true
  belongs_to :user_joined_event, optional: true, dependent: :destroy
  after_save :process_user_joined_event

  scope :connected, -> { where("updated_at > (current_timestamp - interval '2 minute')") }

  # Only 1 user allowed to view per video
  validates :user_id,
            uniqueness: {
              allow_nil: true,
              scope: :video_id,
            }

  # # If its a "NULL" user, only 1 set of unique details allowed.
  validates :details,
            uniqueness: {scope: %i[video_id user_id]}

  def self.process_view!(video, user, request)
    details = {
      ip_address: request.remote_ip,
      browser: request.user_agent,
    }
    video_view = find_existing(video, user, details)
    video_view ||= video.video_views.build(
      details: details,
    )
    video_view.last_seen_at = Time.zone.now
    video_view.user = user
    video_view.save! if video_view.valid?
    video_view
  end

  def self.find_existing(video, user, details)
    video_view ||= video.video_views.find_by(user: user) if user
    return video_view if video_view

    video_view = video.video_views.find_by(details: details)
    return video_view if video_view && (video_view.user.nil? || video_view.user == user)
  end

  def process_user_joined_event
    allowable_states = %w[pending live starting]

    return if !allowable_states.include?(video.state)
    return if !user
    return if user_joined_event_id

    create_user_joined_event(
      video: video,
      user: user,
    )
  end
end
