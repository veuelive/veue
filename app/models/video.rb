# frozen_string_literal: true

class Video < ApplicationRecord
  belongs_to :user

  has_many :chat_messages, dependent: :destroy
  has_many :browser_navigations, dependent: :destroy
  has_many :video_events, dependent: :destroy

  has_many :mux_webhooks, dependent: :nullify
  scope :active, -> { where(state: %w[pending live]) }

  after_save :broadcast_active_viewers, if: -> { saved_change_to_active_viewers? }

  aasm column: "state" do
    # We aren't live yet, but it'sa coming!
    state :pending, initial: true

    # The video is live! Things are happening!
    # Despite the name, normally this comes from a "recording" event coming from Mux
    state :live

    # The stream is over, but we might not be ready to do replay yet
    state :finished

    event :go_live do
      before do
        self.started_at_ms = Time.now.utc.to_ms
      end

      transitions from: :pending, to: :live
    end

    event :finish do
      transitions from: %i[live paused pending], to: :finished
    end
  end

  def change_playback_id(new_playback_id)
    self.mux_playback_id = new_playback_id
    self.hls_url = "https://stream.mux.com/#{new_playback_id}.m3u8"
  end

  def broadcast_active_viewers
    ActionCable.server.broadcast(
      "active_viewers_#{id}",
      {
        viewers: active_viewers,
      },
    )
  end
end
