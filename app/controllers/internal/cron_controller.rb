# frozen_string_literal: true

module Internal
  class CronController < ApplicationController
    def trigger
      stale_videos = Video.stale.all
      logger.info "Cancelling #{stale_videos.count} videos"
      stale_videos.each(&:cancel!)

      render(json: {ok: true, cancelled_videos: stale_videos.count})
    end
  end
end
