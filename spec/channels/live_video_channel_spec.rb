# frozen_string_literal: true

require "rails_helper"

describe LiveVideoChannel, type: :channel do
  let(:video) { create(:video) }

  before do
    stub_connection video_id: video.id
  end

  it "subscribes to a stream with room id provided" do
    subscribe

    expect(subscription).to be_confirmed
    expect(subscription).to have_stream_from("live_video_#{video.id}")
  end
end
