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

    options_obj = Selenium::WebDriver::Chrome::Options.new(args: options)
    options_obj.add_preference(
      "profile.content_settings.exceptions.clipboard",
      {
        '*': {'setting': 1},
      },
    )
    Capybara::Selenium::Driver.new(
      app,
      browser: :chrome,
      options: options_obj,
    )
  end

  #  This is for when we are debugging
  Capybara.register_driver(:debug_browser) do |app|
    options = %w[
      disable-popup-blocking
      disable-translate
      use-fake-ui-for-media-stream
      use-fake-device-for-media-stream
      auto-open-devtools-for-tabs
      test-type
      window-size=2400,2400
    ]

    options_obj = Selenium::WebDriver::Chrome::Options.new(args: options)
    options_obj.add_preference(
      "profile.content_settings.exceptions.clipboard",
      {
        '*': {'setting': 1},
      },
    )
    Capybara::Selenium::Driver.new(
      app,
      browser: :chrome,
      options: options_obj,
    )
  end

  config.before(:example, type: :system) do
    if ENV["RUBYLIB"] =~ /ruby-debug-ide/
      driven_by :debug_browser
    else
      driven_by :selenium, using: (ENV["SPEC_BROWSER"] || :headless_chrome).to_sym
    end
  end
end

require File.join(__dir__, "support/precompile_assets.rb")
