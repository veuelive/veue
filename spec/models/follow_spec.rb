# frozen_string_literal: true

require "rails_helper"

RSpec.describe Follow, type: :model do
  let(:channel_one) { create(:channel) }
  let(:channel_two) { create(:channel) }
  let(:user) { create(:user) }
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
    channel_one.reload

    expect(channel_one.followers).to include(user)
  end

  it "Can follow multiple channels" do
    expect(channel_two.followers).to_not include(user)

    create(:follow, user: user, channel: channel_two)
    channel_two.reload

    expect(channel_two.followers).to include(user)
  end

  it "User cannot follow self" do
    follow = build(:follow, user: channel_one.user, channel: channel_one)
    expect(follow).to be_invalid
    expect(follow.errors(full_messages)).to include("You can't follow yourself")
  end
end
