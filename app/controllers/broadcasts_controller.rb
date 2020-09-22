# frozen_string_literal: true

class BroadcastsController < ApplicationController
  before_action :authenticate_user!

  def show
    current_user.setup_as_streamer!
    render(layout: "broadcast")
  end

  def page_visit
    current_video.page_visits.create!(
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

  def current_video
    current_user.videos.live.first
  end
end
