# frozen_string_literal: true

class VideosController < ApplicationController
  before_action :increment_video_views, only: %i[show]

  # GET /videos
  def index
    @live_videos = Video.live.all.decorate
    @recent_videos = Video.finished.all.decorate
  end

  # GET /videos/1
  def show; end

  private

  def increment_video_views
    current_video.video_views.create!(
      user: current_user,
      details: request_details,
    )
  end

  def request_details
    {
      ip_address: request.remote_ip,
      browser: request.user_agent,
    }
  end

  # Use callbacks to share common setup or constraints between actions.
  def current_video
    @current_video ||= Video.find(params[:id]).decorate
  end
  helper_method :current_video

  # Only allow a list of trusted parameters through.
  def video_params
    params.require(:video).permit(:title)
  end
end
