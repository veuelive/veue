# frozen_string_literal: true

module Channels
  class VideosController < ApplicationController
    include ChannelConcern

    # GET /videos/1
    def show
      authorize!(:read, current_video)

      primary_shot = current_video.primary_shot.variant(resize_and_pad: [500, 500, {background: "black"}]).processed

      # Social vars
      @og_image = @twitter_image = Router.url_for_variant(primary_shot)
      @og_title = @twitter_title = current_video.title
      @og_description = @twitter_description = "Watch #{current_channel.name} on Veue!"

      # have to decorate after authorizing
      @current_video = @current_video.decorate

      render(layout: false) if xhr_request?
    end

    def viewed
      VideoView.process_view!(current_video, current_user, params[:minute], user_fingerprint, false)
    end

    def current_video
      @current_video ||= Video.find(params[:id])
    end
    helper_method :current_video

    def current_channel
      current_video.channel.decorate
    end
    helper_method :current_channel
  end
end
