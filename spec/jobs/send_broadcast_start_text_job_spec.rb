# frozen_string_literal: true

require "rails_helper"

RSpec.describe SendBroadcastStartTextJob, type: :job do
  let(:channel) { create(:channel) }
  let(:follower) { create(:user) }
  let(:other_follower) { create(:user) }

  include ActiveJob::TestHelper

  before :example do
    Follow.create!(user: follower, channel: channel)
    Follow.create!(user: other_follower, channel: channel)
  end

  describe "Live public videos" do
    # Cannot be lazy loaded!
    let!(:active_video) { create(:live_video, channel: channel) }

    it "should run without error" do
      SendBroadcastStartTextJob.perform_later(channel)
      expect(SendBroadcastStartTextJob).to have_been_enqueued.exactly(:once)

      # A second job is queued, the first one is just a batch
      perform_enqueued_jobs(only: SendBroadcastStartTextJob)
      expect(SendBroadcastStartTextJob).to have_been_enqueued.exactly(:once)
    end

    it "should run in batches based on batch_size" do
      # Performing now causes 2 jobs to be queued in the background
      # We do perform_now because it will queue 2 "perform_later" in the background
      SendBroadcastStartTextJob.perform_now(channel, batch_size: 1)
      expect(SendBroadcastStartTextJob).to have_been_enqueued.exactly(:twice)
    end

    it "should send a message to Twilio" do
      SendBroadcastStartTextJob.perform_now(channel)
      perform_enqueued_jobs(only: SendBroadcastStartTextJob)
      expect(FakeTwilio.messages.size).to eq(2)

      phone_numbers = channel.followers.pluck(:phone_number)

      message = FakeTwilio.messages.first
      # Should contain a full url
      expect(message.body).to match(%r{http://test.localhost})

      expect(message.body).to match(channel.slug)
      expect(message.body).to match(channel.active_video.id)

      expect(phone_numbers).to include(message.to)
    end
  end
end
