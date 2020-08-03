# frozen_string_literal: true

class MuxWebhook < ApplicationRecord
  belongs_to :mux_target, polymorphic: true, optional: true
  validates :mux_id, presence: true, uniqueness: true

  LIVE_SHOULD_START_EVENT = "video.live_stream.active"

  def process!
    logger.warn("No specific handler for webhook of type #{event}")
  end

  # Helper method to split up a long series of event names to the core items
  # Aka, "video.live_stream.disconnected" => "disconnected"
  def event_name
    @event_name ||= event.split(".").last
  end

  # This isn't always safe... but this is helpful for many webhook callback responses
  def get_playback_id
    payload["playback_ids"].each do |playback|
      return playback["id"] if playback["policy"] == "public"
    end
    nil
  end

  class << self
    def handle_webhook(json)
      data = JSON.parse(json)

      # If we've already processed this webhook... just let it pass!
      return if MuxWebhook.where("mux_id = ?", data["id"]).any?

      # For debug purposes, sometimes we want to record webhooks to disk!
      record_webhook(json, data) if ENV["RECORD_WEBHOOKS"]

      webhook = build_from_json(data)

      logger.debug "Setting Job for Later"
      MuxWebhookJob.perform_later webhook
    end

    def record_webhook(json, data)
      # Write this data to a file that's in the test repository
      # We can use this for testing
      event_name = data["type"].split(".").last
      filename = "#{Time.now.to_i}-#{event_name}.json"
      File.open(Rails.root.join("spec/support/webhooks/", filename), "w+") do |file|
        file.write(json)
      end
    end

    def build_from_json(webhook_payload)

      klass, mux_target = determine_target(webhook_payload)

      klass.create!(
        event: webhook_payload["type"],
        mux_id: webhook_payload["id"],
        event_received_at: webhook_payload["created_at"],
        mux_environment: webhook_payload["environment"]["name"],
        mux_target: mux_target,
        payload: webhook_payload["data"],
        mux_request_id: webhook_payload["request_id"],
      )
    end

    def determine_target(payload)
      object = payload["object"]
      case object["type"]
      when "asset"
        klass = MuxAssetWebhook
        mux_target = MuxAsset.find_or_create_by!(mux_id: object["id"])
      when "live"
        klass = MuxLiveStreamWebhook
        mux_target = MuxLiveStream.find_or_create_by!(mux_id: object["id"])
      else
        klass = MuxWebhook
        mux_target = nil
      end
      [klass, mux_target]
    end
  end
end
