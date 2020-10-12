# frozen_string_literal: true

require "rails_helper"

RSpec.describe ActiveViewersChannel, type: :channel do
  let(:video) { create(:video) }

  before do
    stub_connection video_id: video.to_param
  end

  it "subscribes to a stream with video id provided" do
    subscribe(videoId: video.to_param)

    expect(subscription).to be_confirmed
    expect(subscription).to have_stream_from("active_viewers_#{video.to_param}")
  end
end
