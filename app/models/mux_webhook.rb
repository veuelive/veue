# frozen_string_literal: true

class MuxWebhook < ApplicationRecord
  belongs_to :channel, optional: true
  belongs_to :video, optional: true
  validates :mux_id, presence: true, uniqueness: true

  # This isn't always safe... but this is helpful for many webhook callback responses
  def playback_id
    payload["data"]["playback_ids"].each do |playback|
      return playback["id"] if playback["policy"] == "public"
    end
    nil
  end

  def log_webhook_error(description)
    Rails.logger.error("Webhook: #{id} - #{event_type} - #{description}")
  end

  def self.handle_webhook(json)
    data = JSON.parse(json)

    # If we've already processed this webhook... just let it pass!
    return if MuxWebhook.where("mux_id = ?", data["id"]).any?

    webhook = build_from_json(data)

    logger.debug "Setting Job for Later"
    MuxWebhookJob.perform_later webhook
  end

  def self.build_from_json(webhook_payload)
    video, = determine_target(webhook_payload)

    create!(
      event_type: webhook_payload["type"],
      mux_id: webhook_payload["id"],
      event_received_at: webhook_payload["created_at"],
      mux_environment: webhook_payload["environment"]["name"],
      video: video,
      payload: webhook_payload,
      mux_request_id: webhook_payload["request_id"],
    )
  end

  def self.determine_target(payload)
    object = payload["object"]
    case object["type"]
    when "asset"
      channel = Channel.find_by(mux_live_stream_id: payload["data"]["live_stream_id"])
      video = Video.find_by(mux_asset_id: object["id"]) || channel.active_video
    when "live"
      channel = Channel.find_by(mux_live_stream_id: object["id"])
      video = channel.active_video
    else
      video = nil
      channel = nil
    end
    [video, channel]
  end
end
