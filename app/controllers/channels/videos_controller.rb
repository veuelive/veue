# frozen_string_literal: true

module Channels
  class VideosController < ApplicationController
    # GET /videos/1
    def show
      render("not_found", status: :not_found) && return unless current_video.can_be_accessed_by(current_user)

      render(layout: false) && return if xhr_request?

      viewed
    end

    def viewed
      VideoView.process_view!(current_video, current_user, request)
    end

    def current_video
      @current_video ||= Video.find(params[:id]).decorate
    end
    helper_method :current_video

    def current_channel
      current_video.channel
    end
    helper_method :current_channel
  end
end
