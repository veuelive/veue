# frozen_string_literal: true

require "rails_helper"

RSpec.describe Follow, type: :model do
  let(:user) { create(:user) }
  let(:user_two) { create(:user) }
  let(:channel_one) { create(:channel) }
  let(:channel_two) { create(:channel) }
  let(:host_one) { create(:host, channel: channel_one, user: user_two) }
  let(:host_two) { create(:host, channel: channel_two, user: user) }
  let!(:follow) { create(:follow, user: user, channel: channel_one) }

  it "Cannot follow the same channel twice" do
    expect(channel_one.followers).to include(user)
    expect { create(:follow, user: user, channel: channel_one) }.to raise_error(ActiveRecord::RecordInvalid)
  end

  it "Can refollow a channel after unfollowing" do
    follow.unfollow!

    expect(channel_one.followers).to_not include(user)

    create(:follow, user: user, channel: channel_one)

    # Have to reload channel_one or it doesnt propagate the new follow
    expect(channel_one.reload.followers).to include(user)
  end

  it "Can follow multiple channels" do
    expect(channel_two.followers).to_not include(user)

    create(:follow, user: user, channel: channel_two)
    expect(channel_two.reload.followers).to include(user)
  end

  it "should prevent user from following themselves" do
    follow = build_stubbed(:follow, user: channel_one.user, channel: channel_one)
    expect(follow).to be_invalid
    expect(follow.errors.full_messages.join("\n")).to include("You can't follow yourself")
  end
end
