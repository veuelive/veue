# frozen_string_literal: true

require "rails_helper"

RSpec.describe User, type: :model do
  # Use streamer since streamers are users with more permissions
  # An issue was found specific to mux_webhooks not being referenced in our migrations
  it "should allow us to delete users" do
    user = create(:streamer)
    expect { user.destroy! }.to change { User.count }.from(1).to(0)
  end

  describe "authorization" do
    let(:user) { create(:user) }
    let(:random_user) { create(:user) }
    let(:admin_user) { create(:admin) }

    it "Should allow users to edit their own profile and allow admins to edit any user" do
      abilities = [Ability.new(user), Ability.new(admin_user)]

      abilities.each do |ability|
        %i[manage create read update destroy].each do |action|
          expect(ability.can?(action, user)).to eq(true)
        end
      end
    end

    it "Should only allow non-users and users who do not have access read permission to a profile" do
      abilities = [Ability.new(random_user), Ability.new(nil)]

      abilities.each do |ability|
        # A random / non-user should be able to only read the video.
        expect(ability.can?(:read, user)).to eq(true)

        # A random user cannot
        %i[manage create update destroy].each do |action|
          expect(ability.cannot?(action, user)).to eq(true)
        end
      end
    end
  end

  describe "setup as streamer" do
    let(:user) { create(:user) }

    it "should have user setup as streamer" do
      user.setup_as_streamer!
      channels = user.channels
      expect(channels.count).to eq(1)
      expect(channels.first.name).to eq(user.display_name)
    end
  end
end
