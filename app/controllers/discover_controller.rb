# frozen_string_literal: true

class DiscoverController < ApplicationController
  # GET /discover or /
  def index
    @live_videos = Video.live.visibility_public.all.decorate
    @recent_videos = Video.finished.visibility_public.all.decorate
  end
end
