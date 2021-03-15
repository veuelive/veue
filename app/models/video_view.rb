# frozen_string_literal: true

class VideoView < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :video, counter_cache: true
  belongs_to :user_joined_event, optional: true, dependent: :destroy
  has_many :video_view_minutes, dependent: :destroy

  after_commit :process_user_joined_event

  scope :connected, -> { where("updated_at > (current_timestamp - interval '2 minute')") }

  # Only 1 user allowed to view per video
  validates :user_id,
            uniqueness: {
              allow_nil: true,
              scope: :video_id,
            }

  # This is the main method we use to track new views and build the logic around how we find them
  def self.process_view!(video, user, minute, fingerprint, is_live)
    # If you are the video creator, your views don't matter... MUWAHAHAHAHAH!
    return if video.user_id == user&.id

    video_view = find_existing(video, user, fingerprint) || video.video_views.build
    video_view.user ||= user
    video_view.fingerprint = fingerprint
    video_view.add_minute!(minute, is_live)
    video_view
  end

  def self.find_existing(video, user, fingerprint)
    video.video_views.find_by(fingerprint: fingerprint) || search_by_user(video, user)
  end

  def self.search_by_user(video, user)
    video.video_views.find_by(user: user) if user
  end

  def add_minute!(minute, is_live)
    self.last_seen_at = Time.zone.now

    minute = Integer(minute, 10) unless minute.is_a?(Integer)

    # Ensure that we don't double count viewing the same minute more than a day apart
    if video_view_minutes
       .where("created_at > ?", 1.day.ago)
       .where(minute: minute)
       .none?

      video_view_minutes.build(minute: minute, is_live: is_live)
    end

    save!
  end

  private

  def process_user_joined_event
    return unless can_process_user_joined_event?

    create_user_joined_event(
      video: video,
      user: user,
    )
  end

  def can_process_user_joined_event?
    allowable_states = %w[pending live starting]

    # Video isn't active
    return false unless allowable_states.include?(video.state)
    # Not logged in
    return false unless user
    # Already created
    return false if user_joined_event_id

    # Not above the rate limit over 1 minute period
    video.user_joined_events.where("created_at >= ?", 1.minute.ago).count < USER_JOIN_RATE_LIMIT
  end
end
