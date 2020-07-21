# frozen_string_literal: true

class MuxWebhook < ApplicationRecord
  belongs_to :mux_target, polymorphic: true, optional: true

  class << self
    def build_from_json(json)
      payload = JSON.parse(json)

      klass, mux_target = determine_target(payload)

      klass.create!(
        event: payload["type"],
        webhook_id: payload["id"],
        event_at: payload["created_at"],
        environment: payload["environment"]["name"],
        mux_target: mux_target,
        json: json
      )
    end

    def determine_target(payload)
      case payload["object"]
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
