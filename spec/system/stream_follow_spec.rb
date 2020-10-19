# frozen_string_literal: true

require "system_helper"

RSpec.describe "Follow live streamer" do
  let(:streamer) { create(:streamer) }
  let(:follower) { create(:user) }
  let(:video) { create(:video, user: streamer) }

  before :example do
    visit video_path(video)
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
      visit video_path(video)
      find(".follow-btn").click
      expect(page).to have_content("Unfollow")
    end

    it "should make user unfollowed streamer" do
      @follow = Follow.create!(
        streamer_id: streamer.to_param,
        follower_id: follower.to_param,
      )
      visit video_path(video)
      find(".follow-btn").click

      expect(page).to have_content("Follow")
    end
  end
end
