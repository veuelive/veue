# frozen_string_literal: true

class Video < ApplicationRecord
  include VideoStates

  # Needed for AASM + ActiveAdmin
  # https://github.com/activeadmin/activeadmin/wiki/How-to-work-with-AASM
  attr_accessor :active_admin_requested_event

  belongs_to :channel
  belongs_to :user

  has_many :chat_messages, dependent: :destroy
  has_many :user_joined_events, dependent: :destroy
  has_many :pin_events, dependent: :destroy
  has_many :video_events, dependent: :destroy
  has_many :video_layout_events, dependent: :destroy
  has_many :video_views, dependent: :destroy
  has_many :video_snapshots, dependent: :destroy
  has_many :video_categories, dependent: :destroy
  has_many :categories, through: :video_categories

  has_one_attached :primary_shot
  has_one_attached :secondary_shot

  has_many :pins, dependent: :destroy

  has_many :mux_webhooks, dependent: :nullify
  scope :active, -> { where(state: %w[pending live starting scheduled]) }
  scope :done, -> { where(state: %w[finished failed ended cancelled]) }

  after_save :broadcast_active_viewers, if: -> { saved_change_to_active_viewers? }

  include PGEnum(visibility: %w[public protected private], _prefix: "visibility")

  validates :title, allow_nil: true, length: {maximum: 60}
  validates :start_offset,
            :end_offset,
            numericality: {greater_than_or_equal_to: 0, only_integer: true}
  validate :scheduled_at, :validate_scheduling, if: -> { scheduled_at.present? && scheduled_at_changed? }

  after_commit :update_scheduled_state!, on: %i[create update], if: -> { saved_change_to_scheduled_at? }

  scope :public_or_protected,
        -> {
          where('"Videos"."visibility" = "public" OR "Videos"."visibility" = "protected" ')
        }

  scope :stale,
        -> {
          pending.where("updated_at <= ?", 30.minutes.ago).or(scheduled.where("scheduled_at <= ?", 1.hour.ago))
        }

  scope :most_recent,
        -> {
          order("started_at_ms DESC")
        }

  scope :most_viewed,
        -> {
          order("video_views_count DESC")
        }

  scope :popular_from_date,
        ->(date) {
          Video.joins(:video_views).group(:id).where(
            "video_views.created_at >= ?",
            date,
          ).order("COUNT(video_views.id) DESC")
        }

  scope :popular_this_week, -> { popular_from_date(1.week.ago) }
  scope :popular_this_month, -> { popular_from_date(1.month.ago) }
  scope :popular_all_time, -> { most_viewed }

  scope :trending_this_week, -> { popular_this_week }
  scope :trending_this_month, -> { popular_this_month }

  scope :private_videos, -> { where(visibility: "private") }
  scope :public_videos, -> { where(visibility: "public") }
  scope :protected_videos, -> { where(visibility: "protected") }

  def self.visibilities_legend
    {
      public: "Everyone can view",
      private: "Only you can view",
      protected: "Only viewable with link",
    }
  end

  def change_playback_id(new_playback_id)
    self.mux_playback_id = new_playback_id
    self.hls_url = "https://stream.mux.com/#{new_playback_id}.m3u8"
  end

  def transition_audience_to_live
    GripBroadcaster.send_message(channel.id, "live", {state: state, type: "StateChange", timecodeMs: 0})
  end

  def recent_events_for_live
    recent_instant_events + recent_timecode_sorted_events
  end

  def recent_timecode_sorted_events
    layout_events = video_layout_events.order("created_at").limit(10)
    (pin_events.published + layout_events.published)
      .sort_by(&:timecode_ms)
  end

  def recent_instant_events
    user_joins = user_joined_events.published.order("created_at DESC").limit(10)
    (chat_messages_for_live + user_joins)
      .sort_by(&:created_at)
      .map { |event|
        event.timecode_ms = 0
        event
      }
  end

  # This is the primary way to start a broadcast
  def start_broadcast!(params)
    new_layout_event!(params[:video_layout])

    # The actual state machine transition
    start!
  end

  def new_layout_event!(layout_event)
    layout_event = JSON.parse(layout_event) if layout_event.is_a?(String)

    video_layout_events.create!(
      input: layout_event.to_hash,
      user: user,
    )
  end

  def chat_messages_for_live(limit=50)
    chat_messages.published.limit(limit).order("created_at DESC")
  end

  def validate_scheduling
    errors.add(:scheduled_at, :not_scheduleable, message: "Video is not scheduleable") unless may_schedule?
    return unless Time.current > scheduled_at

    errors.add(
      :scheduled_at,
      :in_the_past,
      message: "Video cannot be scheduled in the past",
    )
  end

  # Used in an after_create / after_update callback to change the AASM state
  # of the video. Should not be called directly
  def update_scheduled_state!
    if scheduled? && scheduled_at.blank?
      cancel!
    else
      schedule!
    end
  end

  def attach_primary_shot!(snapshot)
    primary_shot.attach(snapshot.image.blob)
  end

  def attach_secondary_shot!(snapshot)
    secondary_shot.attach(snapshot.image.blob)
  end

  def attach_initial_shot!(snapshot)
    attach_primary_shot!(snapshot) if snapshot.priority == 1
    attach_secondary_shot!(snapshot) if snapshot.priority == 2
  end

  def purge_or_attach_secondary_shot!(snapshot)
    return secondary_shot.purge if snapshot.secondary_shot?(self)

    attach_secondary_shot!(snapshot)
  end

  private

  def after_go_live
    transition_audience_to_live

    return unless visibility.eql?("public")

    send_ifttt!("#{user.display_name} went live!")
    send_broadcast_start_text!
  end

  def after_end
    send_ifttt!("#{user.display_name} stopped streaming") if visibility.eql?("public")
  end

  def send_ifttt!(message)
    url = Router.channel_video_url(channel, self)
    IfThisThenThatJob.perform_later(message: message, url: url)
  end

  def send_broadcast_start_text!
    SendBroadcastStartTextJob.perform_later(channel)
  end
end
