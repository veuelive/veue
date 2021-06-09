# frozen_string_literal: true

require "rails_helper"

RSpec.describe DiscoverChannels::Component, type: :component do
  let(:title) { "my title" }
  let(:channels) { create_list(:channel, 3) }

  subject { render_inline(described_class.new(title: title, channels: channels)) }

  it "should render with a title" do
    expect(subject).to have_content(title)
  end

  it "should render the channel cards with links" do
    channels.each do |channel|
      expect(subject).to have_selector("a[href*='#{channel.slug}']")
    end
  end
end
