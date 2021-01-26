# frozen_string_literal: true

require "rails_helper"

describe Internal::CronController do
  describe "staleness pruning" do
    include ActiveSupport::Testing::TimeHelpers

    it "should cancel stale videos" do
      video = create(:video)
      expect(video).to be_pending

      travel 30.minutes

      get cron_path

      video.reload
      expect(video).to be_cancelled
    end
  end
end
