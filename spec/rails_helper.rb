# frozen_string_literal: true

# This file is copied to spec/ when you run 'rails generate rspec:install'
require "spec_helper"

ENV["RAILS_ENV"] ||= "test"
require File.expand_path("../config/environment", __dir__)
# Prevent database truncation if the environment is production
abort("The Rails environment is running in production mode!") if Rails.env.production?
require "rspec/rails"
# Add additional requires below this line. Rails is not loaded until this point!

Dir[Rails.root.join("spec/support/**/*.rb")].sort.each { |f| require f }

# Checks for pending migrations and applies them before tests are run.
# If you are not using ActiveRecord, you can remove these lines.
begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  puts e.to_s.strip
  exit(1)
end

# https://thoughtbot.com/blog/how-to-stub-external-services-in-tests
require "webmock/rspec"
WebMock.disable_net_connect!(
  allow_localhost: true,
  allow: [Regexp.new(GripBroadcaster.base_url), %(https://chromedriver.storage.googleapis.com)],
)

RSpec.configure do |config|
  # Allows you to do things like *_url(<model>)
  config.include Rails.application.routes.url_helpers
  config.include AuthenticationTestHelpers::RequestHelpers, type: :request
  config.include ActionDispatch::TestProcess::FixtureFile, type: :request

  config.include UrlSpecHelpers
  config.include WebhookHelpers
  config.include PhoneTestHelpers
  config.include ResponsiveHelpers
  config.include UploadSpecHelper
  config.include SseSpecHelpers
  config.include I8tnSpecHelpers

  config.before(:all) do
    ENV["IFTTT_PUSH_KEY"] = ENV.fetch("IFTTT_PUSH_KEY", "1234")
  end

  config.before(:each) do
    stub_const("Twilio::REST::Client", FakeTwilio)
    FakeTwilio.reset!
    stub_const("MUX_SERVICE", FakeMuxService.new)

    WebMock.reset!
    setup_perspective_mocks!
    stub_request(:post, /#{IfThisThenThatJob.post_url}/)
      .to_return(status: 200, body: "stubbed response", headers: {})

    stub_request(:get, "https://api.buttercms.com/v2/pages/*/homepage-en/?auth_token=TEST_TOKEN&preview")
      .with(
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip;q=1.0,deflate;q=0.6,identity;q=0.3",
          "User-Agent": "ButterCMS/Ruby 1.8",
        },
      )
      .to_return(status: 404, body: {detail: "Page not found."}.to_json, headers: {})
  end

  Capybara.default_max_wait_time = 5

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  Lockbox.master_key = "0000000000000000000000000000000000000000000000000000000000000000"

  ButterCMS.api_token = "TEST_TOKEN"

  # RSpec Rails can automatically mix in different behaviours to your tests
  # based on their file location, for example enabling you to call `get` and
  # `post` in specs under `spec/controllers`.
  #
  # You can disable this behaviour by removing the line below, and instead
  # explicitly tag your specs with their type, e.g.:
  #
  #     RSpec.describe UsersController, type: :controller do
  #       # ...
  #     end
  #
  # The different available types are documented in the features, such as in
  # https://relishapp.com/rspec/rspec-rails/docs
  config.infer_spec_type_from_file_location!

  # Filter lines from Rails gems in backtraces.
  config.filter_rails_from_backtrace!
  # arbitrary gems may also be filtered via:
  # config.filter_gems_from_backtrace("gem name")
end
