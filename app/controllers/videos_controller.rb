# frozen_string_literal: true

class VideosController < ApplicationController
  before_action :current_video, only: %i[show]

  # GET /videos
  def index
    @videos = Video.all.decorate
  end

  # GET /videos/1
  def show; end

  def streamer; end

  private

  # Use callbacks to share common setup or constraints between actions.
  def current_video
    @video = @current_video ||= Video.find(params[:id]).decorate
  end

  # Only allow a list of trusted parameters through.
  def video_params
    params.require(:video).permit(:title)
  end
end
