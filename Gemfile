# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }
ruby "2.7.1"

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem "rails", "~> 6.0.3", ">= 6.0.3.2"

# Use postgres as the database for Active Record
gem "pg", ">= 0.18", "< 2.0"

# Use Puma as the app server
gem "puma", "~> 4.1"

# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem "webpacker"

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem "jbuilder", "~> 2.7"

# Use Redis adapter to run Action Cable in production
gem "redis"

# Background Job Running Library for ActiveJob
gem "sidekiq"

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

# Ruby library for working with the video streaming network Mux
gem "mux_ruby"

# Helps us build state machines
gem "aasm"

# Used for our admin interfaces
gem "activeadmin"

# Helps set up role-based access
gem "cancancan"

# A decorator pattern for our models
gem "draper"

# Our APM and alerting provider
gem "appsignal"

# HTTP Client for building API calls
gem "faraday"

# Inline SVGs renderer
gem "inline_svg"

# Twilio for SMS sending
gem "twilio-ruby"

# For image processing and resizing with Active Storage
gem "image_processing"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", ">= 1.4.2", require: false

# Used for uploading assets to S3
gem "aws-sdk-s3", require: false

# for native Enum support in postgres
gem 'activerecord-pg_enum'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem "byebug", platforms: %i[mri mingw x64_mingw]

  # Rubocop for making sure that our code follows standards- like a comment for every gem!
  gem "rubocop-rails", require: false

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
end
