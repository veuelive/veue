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

RSpec.configure do |config|
  config.include AuthenticationTestHelpers::SystemTestHelpers, type: :system
  config.include AuthenticationTestHelpers::RequestHelpers, type: :request
  config.include SystemSpecHelpers, type: :system
  config.include WebhookHelpers
  config.include PhoneTestHelpers
  config.include ResponsiveHelpers
  config.include UploadSpecHelper

  Capybara.register_driver(:media_browser) do |app|
    chrome_options = Selenium::WebDriver::Chrome::Options.new
    chrome_options.add_preference("media.block_autoplay", false)
    chrome_options.add_preference("media.allow_autoplay", true)
    switches = %w[
      disable-popup-blocking
      disable-translate
      use-fake-ui-for-media-stream
      use-fake-device-for-media-stream
      test-type
      headless
    ]

    Capybara::Selenium::Driver.new(app, browser: :chrome, switches: switches, options: chrome_options)
  end

  config.before(:each) do
    stub_const("Twilio::REST::Client", FakeTwilio)
  end

  config.after(:each) do
    FakeTwilio.messages = []
  end

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  Lockbox.master_key = "0000000000000000000000000000000000000000000000000000000000000000"

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
