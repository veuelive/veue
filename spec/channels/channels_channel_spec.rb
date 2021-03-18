# frozen_string_literal: true

require "rails_helper"

RSpec.describe ChannelsChannel, type: :channel do
  let(:channel) { create(:channel) }
  it "subscribes and streams for a channel" do
    subscribe room: channel.slug

    assert_has_stream_for channel
  end
end
