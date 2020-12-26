# frozen_string_literal: true

require "rails_helper"

RSpec.describe SendBroadcastStartTextJob, type: :job do
  let(:channel) { create(:channel) }
  let(:follower) { create(:user) }
  let(:other_follower) { create(:user) }
  let(:video) { create(:video) }

  include ActiveJob::TestHelper

  before :example do
    Follow.create!(user: follower, channel: channel)
    Follow.create!(user: other_follower, channel: channel)
  end

  it "should run without error" do
    args = {
      channel_url: channel_url(video.channel),
      channel: channel,
    }

    SendBroadcastStartTextJob.perform_later(args)
    expect(SendBroadcastStartTextJob).to have_been_enqueued.exactly(:once).with(args)
  end

  it "should run in batches" do
    args = {
      channel_url: channel_url(video.channel),
      channel: channel,
      batch_size: 1,
    }

    # Performing now causes 2 jobs to be queued in the background
    SendBroadcastStartTextJob.perform_now(args)
    expect(SendBroadcastStartTextJob).to have_been_enqueued.exactly(:twice)
  end

  it "should send a message to Twilio" do
    args = {
      channel_url: channel_url(video.channel),
      channel: channel,
    }

    SendBroadcastStartTextJob.perform_now(args)
    perform_enqueued_jobs(only: SendBroadcastStartTextJob)
    expect(FakeTwilio.messages.size).to eq(2)

    phone_numbers = channel.followers.pluck(:phone_number)

    message = FakeTwilio.messages.first
    # Should contain a full url
    expect(message.body).to match(/http/)

    expect(message.body).to match(channel_url(video.channel))

    expect(phone_numbers).to include(message.to)
  end
end
