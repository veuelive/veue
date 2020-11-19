# frozen_string_literal: true

require "rails_helper"

RSpec.describe SendBroadcastStartTextJob, type: :job do
  let(:streamer) { create(:streamer) }
  let(:follower) { create(:user) }
  let(:other_follower) { create(:user) }
  let(:video) { create(:video) }

  include ActiveJob::TestHelper

  before :example do
    Follow.create!(streamer_follow: follower, user_follow: streamer)
    Follow.create!(streamer_follow: other_follower, user_follow: streamer)
  end

  it "should run without error" do
    args = {
      video_url: video_url(video),
      streamer: streamer,
    }

    SendBroadcastStartTextJob.perform_later(args)
    expect(SendBroadcastStartTextJob).to have_been_enqueued.exactly(:once).with(args)
  end

  it "should run in batches" do
    args = {
      video_url: video_url(video),
      streamer: streamer,
      batch_size: 1,
    }

    # Performing now causes 2 jobs to be queued in the background
    SendBroadcastStartTextJob.perform_now(args)
    expect(SendBroadcastStartTextJob).to have_been_enqueued.exactly(:twice)
  end

  it "should send a message to Twilio" do
    args = {
      video_url: video_url(video),
      streamer: streamer,
    }

    SendBroadcastStartTextJob.perform_now(args)
    perform_enqueued_jobs(only: SendBroadcastStartTextJob)
    expect(FakeTwilio.messages.size).to eq(2)

    phone_numbers = streamer.followers.pluck(:phone_number)

    message = FakeTwilio.messages.first
    # Should contain a full url
    expect(message.body).to match(/http/)

    expect(message.body).to match(video_url(video))

    expect(phone_numbers).to include(message.to)
  end
end
