# frozen_string_literal: true

class SseBroadcaster
  def self.broadcast(path, payload)
    Faraday.post("https://leghorn.onrender.com/#{path}", data: payload.to_json)
  end
end
