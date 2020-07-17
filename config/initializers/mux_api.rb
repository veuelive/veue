
require_relative '../../lib/mux_service'

MuxRuby.configure do |config|
  config.username = ENV['MUX_TOKEN_ID']
  config.password = ENV['MUX_TOKEN_SECRET']
end

MUX_SERVICE = MuxService.new