# frozen_string_literal: true

module SseBroadcaster
  def self.host
    "https://leghorn.onrender.com"
  end

  def self.broadcast(path, payload)
    url = "#{host}/#{path}"
    Rails.logger.debug("POSTING MESSAGE TO #{url} " + payload.keys.inspect)
    Faraday.post(url, data: payload.to_json)
  end
end
