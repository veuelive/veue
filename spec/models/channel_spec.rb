# frozen_string_literal: true

require "rails_helper"

RSpec.describe Channel, type: :model do
  let(:channel) { create(:channel) }
  let(:user) { channel.user }
  let(:random_user) { create(:user) }
  let(:admin_user) { create(:admin) }

  describe "creating a new channel" do
    def display_name_to_slug(display_name, slug)
      user = create(:user, display_name: display_name)
      user.setup_as_streamer!
      channel = user.channels.first
      expect(channel.name).to eq(display_name)
      expect(channel.slug).to eq(slug)
    end

    it "should slug appropriately" do
      display_name_to_slug("Hampton", "hampton")
      display_name_to_slug("Slüggy Slugers0n!-", "sluggy-slugers0n")
      display_name_to_slug("hampton", "hampton-live")
    end
  end

  describe "authorization" do
    it "Should allow users to edit their own channel and allow admins to edit any channel" do
      abilities = [Ability.new(user), Ability.new(admin_user)]

      abilities.each do |ability|
        %i[manage create read update destroy].each do |action|
          expect(ability.can?(action, channel)).to eq(true)
        end
      end
    end

    it "Should only allow non-users and users who do not have access read permission to a channel" do
      abilities = [Ability.new(random_user), Ability.new(nil)]

      abilities.each do |ability|
        # A random / non-user should be able to only read the video.
        expect(ability.can?(:read, channel)).to eq(true)

        # A random user cannot
        %i[manage create update destroy].each do |action|
          expect(ability.cannot?(action, channel)).to eq(true)
        end
      end
    end
  end
end
