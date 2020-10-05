# frozen_string_literal: true

class BroadcastsController < ApplicationController
  before_action :authenticate_user!

  def index
    redirect_to(broadcast_path(current_user.active_video!))
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
    @current_broadcast_video ||= current_user.videos.find(params[:id])
  end
  helper_method :current_broadcast_video
end
