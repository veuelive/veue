# frozen_string_literal: true

class Video < ApplicationRecord
  belongs_to :user

  has_many :chat_messages, dependent: :destroy
  has_many :browser_navigations, dependent: :destroy
  has_many :pin_events, dependent: :destroy
  has_many :video_events, dependent: :destroy
  has_many :video_views, dependent: :destroy

  has_many :pins, dependent: :destroy

  has_many :mux_webhooks, dependent: :nullify
  scope :active, -> { where(state: %w[pending live starting]) }

  after_save :broadcast_active_viewers, if: -> { saved_change_to_active_viewers? }

  has_one_attached :secondary_shot
  has_one_attached :primary_shot
  include PGEnum(visibility: %w[public protected private], _prefix: "visibility")

  scope :public_or_protected,
        -> {
          where("\"#{table_name}\".\"visibility\" = 'public' OR" \
                    "\"#{table_name}\".\"visibility\" = 'protected'")
        }

  aasm column: "state" do
    # We aren"t live yet, but it'sa coming!
    state :pending, initial: true

    # The streamer has started, but MUX isn't yet fully live via RTMP. Their clock has started though
    state :starting

    # The video is live! Things are happening!
    # Despite the name, normally this comes from a "recording" event coming from Mux
    state :live

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
      transitions from: :pending, to: :live
      transitions from: :starting, to: :live
    end

    event :finish do
      transitions from: %i[live paused pending], to: :finished
    end
  end

  def change_playback_id(new_playback_id)
    self.mux_playback_id = new_playback_id
    self.hls_url = "https://stream.mux.com/#{new_playback_id}.m3u8"
  end

  def increment_viewers!
    update!(active_viewers: active_viewers + 1) if live?
  end

  def decrement_viewers!
    update!(active_viewers: active_viewers - 1) if live?
  end

  def broadcast_active_viewers
    ActionCable.server.broadcast(
      "active_viewers_#{id}",
      {
        viewers: active_viewers,
      },
    )
  end

  def recent_events_for_live
    navigations = browser_navigations.order("created_at DESC").limit(100)

    (chat_messages_for_live + navigations + pin_events)
      .sort_by(&:timecode_ms)
      .map(&:to_json)
  end

  def chat_messages_for_live(limit=50)
    chat_messages.order("timecode_ms DESC")
                 .limit(limit)
                 .reverse
                 .map do |cm|
      cm.timecode_ms = 0
      cm
    end
  end
end
