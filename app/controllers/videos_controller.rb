# frozen_string_literal: true

class VideosController < ApplicationController
  before_action :current_video, only: %i[show]
  before_action :set_follow, only: %i[show]

  # GET /videos
  def index
    @live_videos = Video.live.all.decorate
    @recent_videos = Video.finished.all.decorate
  end

  # GET /videos/1
  def show; end

  # Use callbacks to share common setup or constraints between actions.
  def current_video
    @current_video ||= Video.find(params[:id]).decorate
  end
  helper_method :current_video

  # set follower if current_user is following streamer of video
  def set_follow
    @follow ||= Follow.find_by(
      follower_user_id: current_user.to_param,
      streamer_user_id: @current_video.user.to_param
    )
  end

  # Only allow a list of trusted parameters through.
  def video_params
    params.require(:video).permit(:title)
  end
end
