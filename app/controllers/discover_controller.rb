# frozen_string_literal: true

class DiscoverController < ApplicationController
  # GET /discover or /
  def index
    # BE CAREFUL only to use this `public_videos` query builder!
    public_videos = Video.visibility_public.most_recent

    @live_videos = public_videos.live.limit(3).decorate
    @recent_videos = public_videos.finished.decorate
    @popular_channels = Channel.most_popular.limit(8).decorate
    @upcoming_videos = public_videos.scheduled.order("scheduled_at asc").limit(12).decorate
  end
end
