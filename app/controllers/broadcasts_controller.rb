# frozen_string_literal: true

class BroadcastsController < ApplicationController
  before_action :authenticate_user!, except: %i[startup blank]

  def index
    current_user.setup_as_streamer!
    channel = current_user.channels.first
    redirect_to(broadcast_path(channel.active_video!))
  end

  def show
    render
  end

  def keepalive
    current_broadcast_video.touch if current_broadcast_video.pending?
    render(json: {state: current_broadcast_video.state})
  end

  def edit
    render(layout: false)
  end

  def update
    if current_broadcast_video.update(video_params)
      render(json: :success)
    else
      render(json: current_broadcast_video.errors.full_messages, status: :unprocessable_entity)
    end
  end

  def start
    current_broadcast_video.start_broadcast!(params.permit(:video_layout, :url))
  end

  def stop
    current_broadcast_video.end!
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
    @current_channel ||= current_user.channels.first&.decorate
  end
  helper_method :current_channel

  def video_params
    params.require(:video).permit(:title, :visibility, :scheduled_at)
  end
end
