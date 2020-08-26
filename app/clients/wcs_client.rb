# frozen_string_literal: true

# This class forms a connection to the FlashPhoner Web Call Server or "WCS"
class WcsClient
  class_attribute :conn, default: Faraday.new

  class << self
    def mixer_startup!(stream_key)
      wcs_post(
        "mixer/startup",
        {
          uri: mixer_uri(stream_key),
          localStreamName: stream_key,
        },
      )
    end

    def mixer_add!(stream_key, stream_name)
      wcs_post(
        "mixer/add",
        {
          uri: mixer_uri(stream_key),
          remoteStreamName: stream_name,
        },
      )
    end

    def republish!(stream_key)
      wcs_post(
        "push/startup",
        {
          streamName: stream_key,
          rtmpUrl: RTMP_URL,
        },
      )
    end

    def mixer_uri(stream_key)
      "mixer://#{stream_key}"
    end

    def wcs_post(path, content={})
      url = URI.join(WCS_URL, "/rest-api/", path).to_s
      http_post(url, content.to_json)
    end

    # This is here to ease testing!
    def http_post(url, body)
      WcsClient.conn.post(
        url,
        body,
        {"Content-Type": "application/json"},
      )
    end
  end
end
