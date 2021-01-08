# frozen_string_literal: true

require "system_helper"

RSpec.describe "Follow from VOD" do
  let(:follower) { create(:user) }
  let(:video) { create(:vod_video) }
  let(:channel) { video.channel }

  before :each do
    visit channel_path(channel)
  end

  describe "an anonymous user" do
    it "will display login modal" do
      find(".follow-btn").click
      expect(page).to have_selector("#phone_number_input")
    end
  end

  describe "user logged in" do
    before do
      login_as(follower)
    end

    it "should make user following the streamer" do
      visit path_for_video(video)
      find(".follow-btn").click
      expect(page).to have_content("Following")
    end

    it "should make user unfollowed streamer" do
      Follow.create!(
        channel: channel,
        user: follower,
      )
      visit path_for_video(video)
      find(".unfollow-btn").click

      expect(page).to have_content("Follow")
    end
  end
end
