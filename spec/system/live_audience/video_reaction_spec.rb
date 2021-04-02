# frozen_string_literal: true

require "system_helper"
require_relative("../../support/audience_spec_helpers")

describe "Video Reaction Event" do
  include AudienceSpecHelpers

  let(:user) { create(:user) }
  let(:video) { create(:live_video) }
  let(:channel) { video.channel }

  before :example do
    resize_window_desktop
  end

  describe "user reaction" do
    before do
      login_as user
      visit channel_path(channel)
      ensure_live_event_source
    end

    it "should display a video heart notification" do
      find(".reaction-button-area").click
      expect(page).to have_css(".user-reaction", wait: 10)

      # Wait for 10 sec until the reaction notification disappears (after
      # timeout) and appears as a chat message event inside messages area.
      expect(page).to have_css("div.messages > .user-reaction", wait: 10)

      # Should have a layout event, a joined event AND a reaction
      expect_to_sse_broadcast(3)
    end
  end
end
