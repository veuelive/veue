# frozen_string_literal: true

class BroadcastsController < ApplicationController
  before_action :authenticate_user!, except: :startup

  def index
    current_user.setup_as_streamer!
    channel = current_user.channels.first
    redirect_to(broadcast_path(channel.active_video!))
  end

  def show
    render
  end

  def update
    if current_broadcast_video.update(video_params)
      render(json: :success)
    else
      render(json: current_broadcast_video.errors, status: :unprocessable_entity)
    end
  end

  def start
    current_broadcast_video.add_screenshots!(params[:primary_shot], params[:secondary_shot])

    BrowserNavigation.create_first_navigation!(
      current_broadcast_video,
      params[:url],
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
    @current_broadcast_video ||= current_channel.videos.find(params[:id]).decorate
  end
  helper_method :current_broadcast_video

  def current_channel
    @current_channel ||= current_user.channels.first
  end
  helper_method :current_channel

  def send_broadcast_start_text!
    SendBroadcastStartTextJob.perform_later(
      channel: current_broadcast_video.channel,
      channel_url: channel_url(current_broadcast_video.channel),
    )
  end

  def video_params
    params.require(:video).permit(:title, :visibility)
  end
end
