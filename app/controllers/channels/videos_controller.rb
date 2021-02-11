# frozen_string_literal: true

module Channels
  class VideosController < ApplicationController
    load_resource :current_video
    # GET /videos/1
    def show
      render("not_found", status: :not_found) if can?(:read, @current_video)

      render(layout: false) if xhr_request?
    end

    def viewed
      VideoView.process_view!(current_video, current_user, params[:minute], user_fingerprint, false)
    end

    def current_video
      @current_video ||= Video.find(params[:id]).decorate
    end
    helper_method :current_video

    def current_channel
      current_video.channel.decorate
    end
    helper_method :current_channel
  end
end
