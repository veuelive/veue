# frozen_string_literal: true

class VideosController < ApplicationController
  # GET /videos
  def index
    @live_videos = Video.live.visibility_public.all.decorate
    @recent_videos = Video.finished.visibility_public.all.decorate
  end

  # GET /videos/1
  def show
    render("not_found", status: :not_found) && return unless current_video.can_be_accessed_by(current_user)

    render(layout: false) && return if xhr_request?

    viewed
  end

  def viewed
    VideoView.process_view!(current_video, current_user, request)
  end

  private

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
