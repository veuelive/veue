# frozen_string_literal: true

class Video < ApplicationRecord
  include VideoStates

  belongs_to :channel
  belongs_to :user

  has_many :chat_messages, dependent: :destroy
  has_many :browser_navigations, dependent: :destroy
  has_many :user_joined_events, dependent: :destroy
  has_many :pin_events, dependent: :destroy
  has_many :video_events, dependent: :destroy
  has_many :video_layout_events, dependent: :destroy
  has_many :video_views, dependent: :destroy

  has_many :pins, dependent: :destroy

  has_many :mux_webhooks, dependent: :nullify
  scope :active, -> { where(state: %w[pending live starting]) }
  scope :done, -> { where(state: %w[finished failed ended]) }

  after_save :broadcast_active_viewers, if: -> { saved_change_to_active_viewers? }

  has_one_attached :secondary_shot
  has_one_attached :primary_shot
  include PGEnum(visibility: %w[public protected private], _prefix: "visibility")

  validates :title, allow_nil: true, length: {maximum: 240}

  scope :public_or_protected,
        -> {
          where('"Videos"."visibility" = "public" OR "Videos"."visibility" = "protected" ')
        }

  scope :most_recent,
        -> {
          order("started_at_ms DESC")
        }

  def self.visibilities_legend
    {
      private: "Only you can view",
      protected: "Only viewable with link",
      public: "Everyone can view",
    }
  end

  def change_playback_id(new_playback_id)
    self.mux_playback_id = new_playback_id
    self.hls_url = "https://stream.mux.com/#{new_playback_id}.m3u8"
  end

  def transition_audience_to_live
    SseBroadcaster.broadcast(channel.id, {state: state, type: "StateChange", timecodeMs: 0})
  end

  def recent_events_for_live
    recent_instant_events + recent_timecode_sorted_events
  end

  def recent_timecode_sorted_events
    layout_events = video_layout_events.order("created_at").limit(10)
    (browser_navigations.order("created_at DESC").limit(100) + pin_events + layout_events)
      .sort_by(&:timecode_ms)
  end

  def recent_instant_events
    user_joins = user_joined_events.order("created_at DESC").limit(10)
    (chat_messages_for_live + user_joins)
      .sort_by(&:created_at)
      .map { |event|
        event.timecode_ms = 0
        event
      }
  end

  # This is the primary way to start a broadcast
  def start_broadcast!(params)
    add_screenshots!(params[:primary_shot], params[:secondary_shot])
    new_layout_event!(params[:video_layout])

    BrowserNavigation.create_first_navigation!(self, params[:url])

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
    chat_messages.limit(limit).order("created_at DESC")
  end

  def can_be_accessed_by(user)
    !(visibility.eql?("private") && (self.user != user))
  end

  def add_screenshots!(*screenshots)
    screenshots.each do |shot|
      next unless shot

      if !primary_shot.attached?
        self.primary_shot = shot
      elsif !secondary_shot.attached?
        self.secondary_shot = shot
      end
    end
  end

  def schedule_for!(datetime)
    return unless may_schedule?

    self.scheduled_at = datetime
    schedule!
  end

  private

  def after_go_live
    transition_audience_to_live

    return unless visibility.eql?("public")

    send_ifttt!("#{user.display_name} went live!")
    send_broadcast_start_text!
  end

  def send_ifttt!(message)
    url = Router.channel_video_url(channel, self)
    IfThisThenThatJob.perform_later(message: message, url: url)
  end

  def send_broadcast_start_text!
    SendBroadcastStartTextJob.perform_later(channel)
  end
end
