# frozen_string_literal: true

class VideosController < ApplicationController
  before_action :set_video, only: %i[show]

  # GET /videos
  # GET /videos.json
  def index
    @videos = Video.all.decorate
  end

  # GET /videos/1
  # GET /videos/1.json
  def show; end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_video
    @video = Video.find(params[:id]).decorate
  end

  # Only allow a list of trusted parameters through.
  def video_params
    params.require(:video).permit(:title)
  end
end
