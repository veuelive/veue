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

  has_one_attached :mp4_video

  has_many :pins, dependent: :destroy

  has_many :mux_webhooks, dependent: :nullify
  scope :active, -> { where(state: %w[pending live starting]) }
  scope :done, -> { where(state: %w[finished failed ended cancelled]) }

  after_save :broadcast_active_viewers, if: -> { saved_change_to_active_viewers? }

  include PGEnum(visibility: %w[public protected private], _prefix: "visibility")

  validates :title, allow_nil: true, length: {maximum: 60}
  validates :start_offset,
            :end_offset,
            numericality: {greater_than_or_equal_to: 0, only_integer: true}

  scope :public_or_protected,
        -> {
          where('"Videos"."visibility" = "public" OR "Videos"."visibility" = "protected" ')
        }

  scope :stale,
        -> {
          pending.where("updated_at <= ?", 30.minutes.ago)
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
            VideoView.arel_table[:created_at].gteq(date),
          ).order(VideoView.arel_table[:id].count.desc)
        }

  scope :popular_this_week, -> { popular_from_date(1.week.ago) }
  scope :popular_this_month, -> { popular_from_date(1.month.ago) }
  scope :popular_all_time, -> { most_viewed }

  scope :trending_from_date,
        ->(date) {
          Video.joins(video_views: :video_view_minutes).group(:id).where(
            VideoViewMinute.arel_table[:created_at].gteq(date),
          ).order(VideoViewMinute.arel_table[:id].count.desc)
        }
  scope :trending_this_week, -> { trending_from_date(1.week.ago) }
  scope :trending_this_month, -> { trending_from_date(1.month.ago) }

  scope :private_videos, -> { where(visibility: "private") }
  scope :public_videos, -> { where(visibility: "public") }
  scope :protected_videos, -> { where(visibility: "protected") }

  scope :not_migrated,
        -> {
          left_joins(
            :mp4_video_attachment,
          ).finished.where(active_storage_attachments: {id: nil}).where.not(hls_url: nil)
        }

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
    attach_initial_shots!

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

  def attach_primary_shot!(snapshot)
    primary_shot.attach(snapshot.image.blob)
  end

  def attach_secondary_shot!(snapshot)
    secondary_shot.attach(snapshot.image.blob)
  end

  def purge_or_attach_secondary_shot!(snapshot)
    return secondary_shot.purge if snapshot.secondary_shot?(self)

    attach_secondary_shot!(snapshot)
  end

  def attach_initial_shots!
    return if primary_shot.attached?

    snapshots = video_snapshots.past_snapshots(25)
    primary_snapshot = snapshots.find_by(priority: 1)
    secondary_snapshot = snapshots.find_by(priority: 2)

    if primary_snapshot
      attach_primary_shot!(primary_snapshot)
      attach_secondary_shot!(secondary_snapshot)
      return
    end

    return if secondary_snapshot&.image&.blob.nil?

    attach_primary_shot!(secondary_snapshot)
  end

  def migrate_to_mp4
    return if hls_url.blank?

    tempfile = ::Tempfile.new(["video", ".mp4"])
    path = tempfile.path
    tempfile.close
    tempfile.unlink

    begin
      system("ffmpeg", "-i", hls_url, "-acodec", "copy", "-bsf:a", "aac_adtstoasc", "-vcodec", "copy", path)
      mp4_video.attach(io: File.open(tempfile), filename: "video-#{id}.mp4")
    ensure
      File.delete(path)
    end
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
