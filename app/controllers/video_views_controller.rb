# frozen_string_literal: true

class VideoViewsController < ApplicationController
  include BrowserDetectionConcern
  def create
    video_view = build_video_view

    unless video_view.save
      render(json: {success: false, error_messages: video_view.errors.full_messages})
      return
    end

    render(json: {success: true})
  end

  private

  def build_video_view
    current_video.video_views.new(
      user: current_user,
      details: request_details,
    )
  end

  def current_video
    @current_video ||= Video.find(params[:video_id])
  end
  helper_method :current_video

  def request_details
    {
      ip_address: request.remote_ip,
      browser: browser_name,
    }
  end
end
