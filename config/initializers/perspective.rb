require_relative "../../lib/perspective_api"

PerspectiveApi.enabled = ENV.fetch('PERSPECTIVE_API_ENABLED', false) == 'true'
PerspectiveApi.key = ENV['GOOGLE_CLOUD_KEY'] if PerspectiveApi.enabled
PerspectiveApi.threshold = ENV.fetch('PERSPECTIVE_API_THRESHOLD', '0.5').to_f

if PerspectiveApi.enabled && !PerspectiveApi.key
  raise "Missing GOOGLE_CLOUD_KEY with enabled API"
end
