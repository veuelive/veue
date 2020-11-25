# frozen_string_literal: true

require "sidekiq/testing"

# https://blog.ministryofvelocity.com/how-to-tdd-activejob-in-rails-5-with-rspec-c1c5afcb697b
# https://github.com/mperham/sidekiq/wiki/Testing
RSpec.configure do |config|
  config.include ActiveJob::TestHelper
  config.before(:all) do
    Sidekiq::Testing.fake!
  end
  config.before(:each) do
    Sidekiq::Worker.clear_all
  end
end
