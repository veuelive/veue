# frozen_string_literal: true

require "system_helper"
require_relative("../support/audience_spec_helpers")

describe "Prerecorded Audience View" do
  include AudienceSpecHelpers

  let(:user) { create(:user) }
  let(:video) { create(:vod_video) }

  describe "anonymous user" do
    it "should have a video to play!" do
      visit video_path(video)

      assert_video_is_playing

      expect(is_video_playing?).to eq(true)

      expect(current_timecode).to be > 0
    end

    it "does not update view count on refresh" do
      view_count =
        proc {
          Integer(find(".widget")["data-views"], 10)
        }

      visit video_path(video)
      initial_view_count = view_count.call

      # Refresh the page
      visit video_path(video)
      refreshed_view_count = view_count.call

      expect(initial_view_count).to eq(refreshed_view_count)

      # Log in to increase the view count
      login_as user
      visit video_path(video)

      logged_in_view_count = view_count.call
      expect(initial_view_count + 1).to eq(logged_in_view_count)

      visit video_path(video)
      refreshed_view_count = view_count.call
      expect(logged_in_view_count).to eq(refreshed_view_count)

      # Log out and refresh page to ensure were still not updating view count
      visit logout_path

      visit video_path(video)
      refreshed_view_count = view_count.call
      expect(logged_in_view_count).to eq(refreshed_view_count)
    end
  end
end
