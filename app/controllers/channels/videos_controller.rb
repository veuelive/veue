# frozen_string_literal: true

module Channels
  class VideosController < ApplicationController
    # GET /videos/1
    def show
      # have to undecorate when authorizing
      authorize!(:read, Draper.undecorate(current_video))

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
