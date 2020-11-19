# frozen_string_literal: true

class BroadcastsController < ApplicationController
  before_action :authenticate_user!, except: :startup

  def index
    current_user.setup_as_streamer!
    redirect_to(broadcast_path(current_user.active_video!))
  end

  def show
    render
  end

  def start
    current_broadcast_video.update!(
      primary_shot: params[:primary_shot],
      secondary_shot: params[:secondary_shot],
    )
    current_broadcast_video.browser_navigations.create!(
      timecode_ms: 0,
      user: current_broadcast_video.user,
      input: {
        url: params[:url],
        canGoBack: false,
        canGoForward: false,
        isLoading: false,
      },
    )
    current_broadcast_video.start!

    send_broadcast_start_text!
  end

  def navigation_update
    current_broadcast_video.browser_navigations.create!(
      input: {
        url: params["url"],
        canGoBack: params["canGoBack"],
        canGoForward: params["canGoForward"],
        isLoading: params["isLoading"],
      },
      user: current_user,
      timecode_ms: params["timecodeMs"],
    )
    head(:no_content)
  end

  def blank
    render(layout: false)
  end

  def startup
    index if current_user
  end

  private

  def current_broadcast_video
    @current_broadcast_video ||= current_user.videos.find(params[:id])
  end
  helper_method :current_broadcast_video

  def send_broadcast_start_text!
    SendBroadcastStartTextJob.perform_later(
      streamer: current_user,
      video_url: video_url(current_broadcast_video),
    )
  end
end
