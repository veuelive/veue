# frozen_string_literal: true

require "rails_helper"

RSpec.describe Channel, type: :model do
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
end
