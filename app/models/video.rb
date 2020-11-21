# frozen_string_literal: true

class Video < ApplicationRecord
  belongs_to :user

  has_many :chat_messages, dependent: :destroy
  has_many :browser_navigations, dependent: :destroy
  has_many :user_joined_events, dependent: :destroy
  has_many :pin_events, dependent: :destroy
  has_many :video_events, dependent: :destroy
  has_many :video_views, dependent: :destroy

  has_many :pins, dependent: :destroy

  has_many :mux_webhooks, dependent: :nullify
  scope :active, -> { where(state: %w[pending live starting]) }
  scope :done, -> { where(state: %w[finished failed ended]) }

  after_save :broadcast_active_viewers, if: -> { saved_change_to_active_viewers? }

  has_one_attached :secondary_shot
  has_one_attached :primary_shot
  include PGEnum(visibility: %w[public protected private], _prefix: "visibility")

  scope :public_or_protected,
        -> {
          where('"Videos"."visibility" = "public" OR "Videos"."visibility" = "protected" ')
        }

  aasm column: "state" do
    # We aren"t live yet, but it'sa coming!
    state :pending, initial: true

    # The streamer has started, but MUX isn't yet fully live via RTMP. Their clock has started though
    state :starting

    # The video is live! Things are happening!
    # Despite the name, normally this comes from a "recording" event coming from Mux
    state :live

    # The stream is ending but playback Id is not changed yet!
    state :ended

    # The stream is over, but we might not be ready to do replay yet
    state :finished

    event :start do
      before do
        self.started_at_ms = Time.now.utc.to_ms
      end

      transitions from: :pending, to: :starting
      transitions from: :live, to: :live
    end

    event :go_live do
      after do
        transition_audience_to_live
      end

      transitions from: :pending, to: :live
      transitions from: :starting, to: :live
    end

    event :end do
      transitions from: :live, to: :ended
    end

    event :finish do
      transitions from: %i[live paused pending ended], to: :finished
    end
  end

  def change_playback_id(new_playback_id)
    self.mux_playback_id = new_playback_id
    self.hls_url = "https://stream.mux.com/#{new_playback_id}.m3u8"
  end

  def transition_audience_to_live
    SseBroadcaster.broadcast("videos/#{id}", {state: state, type: "StateChange", timecodeMs: 0})
  end

  def recent_events_for_live
    recent_instant_events + recent_timecode_sorted_events
  end

  def recent_timecode_sorted_events
    navigations = browser_navigations.order("created_at DESC").limit(100)
    (navigations + pin_events)
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

  def chat_messages_for_live(limit=50)
    chat_messages.limit(limit).order("created_at DESC")
  end

  def can_be_accessed_by(user)
    !(visibility.eql?("private") && (self.user != user))
  end
end
