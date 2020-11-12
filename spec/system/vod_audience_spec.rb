# frozen_string_literal: true

require "system_helper"
require_relative("../support/audience_spec_helpers")

describe "Prerecorded Audience View" do
  include AudienceSpecHelpers

  let(:video) { create(:vod_video) }

  describe "anonymous user" do
    it "should have a video to play!" do
      visit video_path(video)

      assert_video_is_playing

      expect(is_video_playing?).to eq(true)

      expect(current_timecode).to be > 0
    end

    it "does not update view count on refresh" do
      visit video_path(video)

      view_count =
        proc {
          Integer(find(".widget")["data-views"], 10)
        }

      initial_view_count = view_count.call

      visit video_path(video)

      refreshed_view_count = view_count.call

      puts initial_view_count
      puts refreshed_view_count
      expect(initial_view_count).to eq(refreshed_view_count)
    end
  end

end
