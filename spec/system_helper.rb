# frozen_string_literal: true

require "rails_helper"

RSpec.configure do |config|
  config.include AuthenticationTestHelpers::SystemTestHelpers, type: :system
  config.include SystemSpecHelpers, type: :system

  # This is for our tests as a Broadcaster
  Capybara.register_driver(:media_browser) do |app|
    options = %w[
      disable-popup-blocking
      disable-translate
      use-fake-ui-for-media-stream
      use-fake-device-for-media-stream
      test-type
      headless
    ]
    Capybara::Selenium::Driver.new(
      app,
      browser: :chrome,
      options: Selenium::WebDriver::Chrome::Options.new(args: options),
    )
  end

  config.before(:example, type: :system) do
    driven_by :selenium, using: (ENV["SPEC_BROWSER"] || :headless_chrome).to_sym
  end
end
