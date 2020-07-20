class MuxWebhook < ApplicationRecord
  belongs_to :mux_target, polymorphic: true, optional: true

  def self.build_from_json(json)
    payload = JSON.parse(json)

    object = payload["object"]
    attributes = {
        event: payload["type"],
        webhook_id: payload["id"],
        event_at: payload["created_at"],
        environment: payload["environment"]["name"],
        json: json
    }

    case object["type"]
    when "asset"
      klass = MuxAssetWebhook
      attributes[:mux_target] = MuxAsset.find_by_mux_id(object["id"])
    when "live"
      klass = MuxLiveStreamWebhook
      attributes[:mux_target] = MuxLiveStream.find_by_mux_id(object["id"])
    else
      klass = MuxWebhook
    end

    klass.create(attributes)
  end
end
