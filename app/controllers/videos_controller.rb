# frozen_string_literal: true

class VideosController < ApplicationController
  before_action :load_video, only: %i[show]
  before_action :increment_video_views, only: %i[show], unless: -> { current_video.live? }

  # GET /videos
  def index
    @live_videos = Video.live.visibility_public.all.decorate
    @recent_videos = Video.finished.visibility_public.all.decorate
  end

  # GET /videos/1
  def show

  end

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
    @current_video
  end
  helper_method :current_video


  def load_video
    if video = Video.public_or_protected.where(id: params[:id]).first
    elsif video = current_user.videos.where(id: params[:id]).first
    else
      render 'not_found', status: :not_found
      return
    end
    @current_video = video.decorate
  end
  
  # Only allow a list of trusted parameters through.
  def video_params
    params.require(:video).permit(:title)
  end
end
