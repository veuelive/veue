# frozen_string_literal: true

class SseBroadcaster
  def self.broadcast(path, payload)
    url = "https://leghorn.onrender.com/#{path}"
    Rails.logger.debug("POSTING MESSAGE TO #{url} " + payload.keys.inspect)
    Faraday.post(url, data: payload.to_json)
  end
end
