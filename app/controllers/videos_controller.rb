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
    # 1) Videos show by id for a publc viewer for someone who has the full id of the video should NOT allow me to see someone else's private video
    #  Failure/Error: .content-area#video-show{data: {"controller" => "audience-view", "audience-view" => { "stream-type" => current_video.stream_type}, "video-id": current_video.id}}
    #
    #  ActionView::Template::Error:
    #    undefined method `stream_type' for nil:NilClass
    # # ./app/views/videos/show.html.haml:1:in `_app_views_videos_show_html_haml___2498435342598989589_37760'
    #
    #
    @current_video
  end
  helper_method :current_video


  def load_video
    if video = Video.public_or_protected.where(id: params[:id]).first&.decorate
    elsif video = current_user.videos.where(id: params[:id]).first&.decorate
    else
      render status: :not_found and return
    end
    @current_video = video
  end



  # Only allow a list of trusted parameters through.
  def video_params
    params.require(:video).permit(:title)
  end
end
