require "buttercms-ruby"

# We include an API token here for development, as it's a READ-ONLY token, vs any write tokens
ButterCMS::api_token = ENV.fetch("BUTTER_CMS_API_TOKEN", "ed5dff5fd5f9fc888e79121ca40470a3fb1f7a81")