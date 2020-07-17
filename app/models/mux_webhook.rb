class MuxWebhook < ApplicationRecord
  belongs_to :stream

  def self.build_from_json(json)
    puts json

    payload = JSON.parse(json)

    object = payload["object"]
    attributes = {
        event: payload["type"],
        webhook_id: payload["id"],
        event_at: payload["created_at"],
        object_type: object["type"],
        object_id: object["id"],
        json: json
    }

    if (stream = find_stream(payload))
      attributes[:stream_id] = stream.id
    end

    MuxWebhook.create(attributes)
  end

  def self.find_stream(payload)
    object = payload["object"]
    case object["type"]
    when "asset"
      return Stream.find_by_mux_asset_id(object["id"])
    when "live"
      return Stream.find_by_mux_live_stream_id(object["id"])
    else
      return nil
    end
  end
end
