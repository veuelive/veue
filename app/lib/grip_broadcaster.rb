# frozen_string_literal: true

require "jwt"

module GripBroadcaster
  # From the docs here https://docs.fanout.io/docs/publishing
  #
  #  and here for SSE specifics https://docs.fanout.io/docs/server-sent-events
  #
  # Example payload:
  #
  # {
  #   "items": [
  #     {
  #       "channel": "mychannel",
  #       "id": "an-item-id",
  #       "prev-id": "another-item-id",
  #       "formats": {
  #         "http-stream": {
  #           "action": "hint"
  #         }
  #       }
  #     }
  #   ]
  # }
  #
  def self.send_message(channel, event_id, message={})
    Rails.logger.info("Broadcasting to channel #{channel} with payload of #{message.inspect}")
    do_request(
      {
        items: [
          channel: channel,
          id: event_id,
          formats: {
            "http-stream": {
              content: "event: message\ndata: #{message.to_json}\n\n",
            },
          },
        ],
      },
    )
  end

  def self.realm_id
    ENV.fetch("GRIP_REALM_ID", "fe9875ce")
  end

  def self.realm_key
    ENV.fetch("GRIP_REALM_KEY", "+oz938I0EV+Y5eC1j/ZT8g==")
  end

  def self.jwt_token
    key = Base64.decode64(realm_key)
    claim = {iss: realm_id, exp: Time.now.to_i + 3600}
    JWT.encode(claim, key)
  end

  def self.conn
    @conn ||=
      Faraday.new do |conn|
        conn.adapter(:net_http_persistent, pool_size: 5) do |http|
          # yields Net::HTTP::Persistent
          http.idle_timeout = 100
        end
        conn.basic_auth(realm_id, realm_key)
      end
  end

  def self.base_url
    ENV.fetch("GRIP_URL", "https://api.fanout.io/realm/")
  end

  def self.do_request(payload={})
    request_url = "#{base_url}#{realm_id}/publish/"

    response = conn.post(
      request_url,
      payload.to_json,
      generate_headers,
    )

    return if response.status == 200

    Rails.logger.error("GRIP broadcast failed")
    Rails.logger.error(response.status)
    Rails.logger.error(response.body)
  end

  def self.generate_headers
    {
      "Content-Type": "application/json",
      Authorization: "Bearer #{jwt_token}",
    }
  end
end
