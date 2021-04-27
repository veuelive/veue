# frozen_string_literal: true

require "rails_helper"

RSpec.describe Host, type: :model do
  let(:channel) { create(:channel) }
  let(:user) { create(:user) }

  it "belongs to channel and user" do
    host = create(:host, user: user, channel: channel)
    expect(host.reload.user).to eq(user)
    expect(host.reload.channel).to eq(channel)
  end
end
