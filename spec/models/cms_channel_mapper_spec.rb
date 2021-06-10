# frozen_string_literal: true

require "rails_helper"

RSpec.describe CmsChannelMapper do
  let(:title) { "My title" }
  let(:channel_one) { create(:channel, followers_count: 5) }
  let(:channel_two) { create(:channel, followers_count: 10) }
  let(:channel_three) { create(:channel, followers_count: 7) }
  let!(:channels) { [channel_one.decorate, channel_two.decorate, channel_three.decorate] }

  let(:mapper) { CmsChannelMapper.new(data) }

  describe "Static Channels" do
    let(:data) {
      {
        type: "static_channel",
        fields: {
          title: title,
          channels: [
            {slug: channel_one.slug},
            {slug: channel_two.slug},
            {slug: channel_three.slug},
          ],
        },
      }
    }

    it "should find all the channels based on slugs" do
      expect(channels).to include(mapper.channels.first)
      expect(channels).to include(mapper.channels.second)
      expect(channels).to include(mapper.channels.third)
    end
  end

  describe "Dynamic Channels" do
    let(:data) {
      {
        type: "dynamic_channels",
        fields: {
          title: "Konnors Dynamic Channels",
          max_size: 2,
          type: "most_popular",
        },
      }
    }

    it "should limit based on max_size" do
      expect(mapper.limit).to eq(2)
      expect(mapper.channels.size).to eq(2)
    end

    it "should call most_popular on the channel" do
      most_popular = Channel.most_popular
      expect(Channel).to receive(:most_popular).exactly(3).times.and_return(most_popular)
      expect(mapper.channels.first).to eq(channel_two)
      expect(mapper.channels.second).to eq(channel_three)
      expect(mapper.channels.third).to be_nil
    end
  end
end
