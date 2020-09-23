# frozen_string_literal: true

class BroadcastsController < ApplicationController
  before_action :authenticate_user!

  def index
    current_user.setup_as_streamer!
    current_video = current_user.videos.where(state: %i[live pending]).first
    redirect_to(broadcast_path((current_video || create_new_broadcast!)))
  end

  def show
    render(layout: "broadcast")
  end

  def page_visit
    current_broadcast_video.page_visits.create!(
      input: {
        url: params[:url],
      },
      user: current_user,
      timecode_ms: params[:timecode_ms],
    )
    head(:no_content)
  end

  def blank
    render(layout: false)
  end

  private

  def current_broadcast_video
    @current_broadcast_video ||= current_user.videos.find_by(slug: params[:id])
  end
  helper_method :current_broadcast_video

  def create_new_broadcast!
    current_user.videos.create!(mux_live_stream: current_user.mux_live_stream)
  end
end
