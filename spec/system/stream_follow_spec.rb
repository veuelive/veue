# frozen_string_literal: true

require "system_helper"

RSpec.describe "Follow from VOD" do
  let(:follower) { create(:user) }
  let(:video) { create(:vod_video) }
  let(:channel) { video.channel }

  before :each do
    visit channel_path(channel)
    resize_window_desktop
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

    describe "is on VOD page" do
      it "can follow" do
        second_video = create(:vod_video, user: channel.user, channel: channel)

        visit path_for_video(video)
        # VEUE-585: this is just confirming that there is another video and the words REPLAY
        # setup for testing after follow
        expect(page).to have_content("REPLAY")
        expect(page).to have_content(second_video.title)

        find(".follow-btn").click
        expect(page).to have_content("Following")

        # VEUE-585: the playback area can disappear occasionally
        expect(page).to have_content("REPLAY")
        expect(page).to have_content(second_video.title)
      end

      it "can unfollow streamer" do
        Follow.create!(
          channel: channel,
          user: follower,
        )
        visit path_for_video(video)
        find(".unfollow-btn").click

        expect(page).to have_css(".streamer-profile", count: 1)

        expect(page).to have_content("Follow")
        expect(page).to have_content("REPLAY")
      end
    end

    describe "channel page" do
      it "should allow following" do
        visit channel_path(video.channel)
        # VEUE-585: this is just confirming that there is another video and the words REPLAY
        # setup for testing after follow
        expect(page).to have_content(video.title)

        find(".follow-btn").click
        expect(page).to have_content("Following")

        # VEUE-585: the playback area can disappear occasionally
        expect(page).to have_content(video.title)
      end
    end
  end

  describe "channel owner logged in" do
    before do
      login_as(channel.user)
    end

    it "should prevent user from following themselves" do
      visit channel_path(channel)
      expect(page).not_to(have_content("Follow"))
    end
  end
end
