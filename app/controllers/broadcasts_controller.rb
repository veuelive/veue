# frozen_string_literal: true

class BroadcastsController < ApplicationController
  before_action :authenticate_user!

  def index
    redirect_to(broadcast_path(current_user.active_video!))
  end

  def show
    render(layout: "broadcast")
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

  private

  def current_broadcast_video
    @current_broadcast_video ||= current_user.videos.find(params[:id])
  end
  helper_method :current_broadcast_video
end
