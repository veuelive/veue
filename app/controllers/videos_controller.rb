# frozen_string_literal: true

class VideosController < ApplicationController
  before_action :current_video, only: %i[show]
  before_action :authenticate_user!, only: %w[new broadcast]

  # GET /videos
  def index
    @videos = Video.all.decorate
  end

  # GET /videos/1
  def show; end

  def new; end

  def broadcast
    # @current_video = current_user.videos.where(id: params[:id]).decorate
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
