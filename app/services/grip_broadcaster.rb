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
  # {"channel":"ab4cd815-c432-4ae2-a997-18a106e8b9a5","id":"755285f3-14b2-44c5-bbcd-56d1103675cc","formats":{"http-stream":{"content":"event: message\ndata: {\"type\":\"ChatMessage\",\"timecodeMs\":0,\"data\":{\"name\":\"Ranger Danger Strang\",\"message\":\"idk\",\"userId\":\"6b72f1a5-ac97-4a6e-a8e7-808bca817896\",\"byStreamer\":true,\"id\":\"755285f3-14b2-44c5-bbcd-56d1103675cc\"},\"viewers\":0}"}}}
  #
  def self.send_message(channel, event_id, message={})
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
    ENV.fetch("GRIP_REALM_ID", "")
  end

  def self.realm_key
    ENV.fetch("GRIP_REALM_KEY", "")
  end

  def self.jwt_token
    key = Base64.decode64(realm_key)
    claim = {iss: realm_id, exp: Time.now.to_i + 3600}
    JWT.encode(claim, key)
  end

  def self.conn
    Faraday.new do |conn|
      conn.basic_auth(realm_id, realm_key)
    end
  end

  def self.do_request(payload={})
    api_url = ENV.fetch("GRIP_URL", "https://api.fanout.io/realm/")
    request_url = "#{api_url}#{realm_id}/publish/"
    response = Faraday.post(
      request_url,
      payload.to_json,
      {
        "Content-Type": "application/json",
        Authorization: "Bearer #{jwt_token}",
      },
    )
    status = response.status

    # return if status == 200

    Rails.logger.error("GRIP broadcast failed")
    Rails.logger.error(response.status)
    Rails.logger.error(response.body)
    Rails.logger.error(request_url)
    Rails.logger.error(payload.to_json)
  end
end
