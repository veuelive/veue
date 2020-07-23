# frozen_string_literal: true

class MuxWebhook < ApplicationRecord
  belongs_to :mux_target, polymorphic: true, optional: true

  def process!
    logger.warn("No specific handler for webhook of type #{event}")
  end

  # Helper method to split up a long series of event names to the core items
  # Aka, "video.live_stream.disconnected" => "disconnected"
  def event_name
    @event_name ||= event.split(".").last
  end

  class << self
    def handle_webhook(json)
      data = JSON.parse(json)
      File.open("test/fixtures/webhooks/#{Time.now.utc.to_i}-#{data['id']}.json", "w+") do |file|
        file.write(json)
      end
      # webhook = build_from_json(json)
      # logger.debug "Setting Job for Later"
      # MuxWebhookJob.perform_later webhook
    end

    def build_from_json(json)
      webhook_payload = JSON.parse(json)

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
        mux_target = MuxAsset.find_by(mux_id: object["id"])
      when "live"
        klass = MuxLiveStreamWebhook
        mux_target = MuxLiveStream.find_by(mux_id: object["id"])
      else
        klass = MuxWebhook
        mux_target = nil
      end
      [klass, mux_target]
    end
  end
end
