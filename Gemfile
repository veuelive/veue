# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }
ruby "2.7.3"

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem "rails", "~> 6.1.3", ">= 6.1.3"

# Use postgres as the database for Active Record
gem "pg", ">= 0.18", "< 2.0"

# Use Puma as the app server
gem "puma", "~> 4.3"

# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem "webpacker"

# Use Redis adapter to run Action Cable in production
gem "redis"

source "https://gems.contribsys.com/" do
  # Background Job Running Library for ActiveJob
  gem "sidekiq-pro"
end

# Used for encrypting our Active Record attributes
gem "lockbox"

# Allows for searching of encrypted fields
gem "blind_index"

# Used for parsing phone numbers
gem "phone"

# Powers our templates
gem "haml-rails"

# Allows us to do development ENV configuration management with a config/application.yml file
gem "figaro"

# Helps us create friendly IDs for the urls
gem "friendly_id"

# Ruby library for working with the video streaming network Mux
gem "mux_ruby"

# Helps us build state machines
gem "aasm"

# Used for our admin interfaces
gem "activeadmin"

# CMS From ButterCMS.com
gem "buttercms-ruby", github: "veuelive/buttercms-ruby", branch: "hcatlin-patch-1"

# Additional addons for increased functionality
gem "activeadmin_addons"

# Required by activeadmin_addons -.- doesnt actually get used since we use
# the webpacker imports...
gem "sassc-rails"

# Helps set up role-based access
gem "cancancan"

# A decorator pattern for our models
gem "draper"

# Allows Draper and CanCanCan to work together
gem "draper-cancancan"

# HTTP Client for building API calls
gem "faraday"

# Adapter for the Faraday HTTP client
gem "net-http-persistent"

# Inline SVGs renderer
gem "inline_svg"

# Twilio for SMS sending
gem "twilio-ruby"

# For image processing and resizing with Active Storage
gem "image_processing"

# Validators for Image upload
gem "activestorage-validator"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", ">= 1.4.2", require: false

# Used for uploading assets to S3
gem "aws-sdk-s3", require: false

# for native Enum support in postgres
gem "activerecord-pg_enum"

# For Windows users, this is required
gem "tzinfo-data", platforms: %i[mingw mswin x64_mingw]

# Allows us to componentize portions of our application
gem "view_component", require: "view_component/engine"

# Pagination!
gem 'pagy', '~> 4'

group :production do
  # Gem for sending production logs to LogDNA
  # TEMPORARY due to https://github.com/logdna/ruby/issues/30
  gem "logdna", github: "logdna/ruby", branch: "master"

  # Our APM and alerting provider
  gem "appsignal"

  # Datadog APM, Etc
  gem "ddtrace", require: "ddtrace/auto_instrument"
end

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem "byebug", platforms: %i[mri mingw x64_mingw]

  # Rubocop for making sure that our code follows standards- like a comment for every gem!
  gem "rubocop-rails", require: false

  # Rubocop....for rspec!
  gem "rubocop-rspec", require: false

  # Security Auditing Linter
  gem "brakeman"

  # Used for our main testing framework
  gem "rspec-rails"

  # For generating fixtures and data
  gem "factory_bot_rails"

  # Generates fake data for our tests- how nice!
  gem "faker"

  # Used for integrating with FFMPEG for RTMP test feeds
  gem "posix-spawn"

  # Recommended for development and test in Windows.
  gem "wdm", ">= 0.1.0", platforms: %i[mingw mswin x64_mingw]
end

group :development do
  # Comes default with Rails 6- used for monitoring file changes
  gem "listen", "~> 3.2"

  # For fast loading Rails development
  gem "spring"

  # I'm guessing this connects listen + spring- came with the default generator
  gem "spring-watcher-listen", "~> 2.0.0"

  # Gives a friendly console interface for bugs during development
  gem "web-console", ">= 3.3.0"
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem "capybara", ">= 2.15"

  # Selenium can pop open a web browser and run tests!
  gem "selenium-webdriver"

  # Easy installation and use of web drivers to run system tests with browsers
  gem "webdrivers"

  # Used for testing JSON responses
  gem "rspec-json_expectations"

  # We use the assigns() helper in our specs, and this gem is needed for it
  gem "rails-controller-testing"

  # Adding Database Cleaner to make sure our DB is clean when we test
  gem "database_cleaner-active_record"

  # Adds the ability to stub requests easily
  gem "webmock"

  # Controls time in tests
  gem "timecop"

  # Allows us access to session tokens during testing
  gem "rack_session_access", "~> 0.2.0"
end
