# frozen_string_literal: true

class DiscoverController < ApplicationController
  # GET /discover or /
  def index
    @live_videos = Video.live.visibility_public.most_recent.limit(3).decorate
    @recent_videos = Video.finished.visibility_public.most_recent.decorate
    @popular_channels = Channel.most_popular.limit(8).decorate
  end
end
