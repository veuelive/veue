# frozen_string_literal: true

module Channels
  class VideosController < ApplicationController
    include ChannelConcern
    include Pagy::Backend

    load_and_authorize_resource except: %w[viewed index]

    # /videos
    def index
      @pagy, @videos = pagy(Video.public_videos.most_recent, count: 30)
    end

    # GET /videos/1
    def show
      authorize!(:read, current_video)

      create_social_variables

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

    private

    # Generate social media variables
    def create_social_variables
      images = current_video.decorate.social_image_hash

      if images[:big_image]
        @twitter_card = "summary_large_image"
        @twitter_image = images[:big_image]
      else
        @twitter_image = images[:thumbnail]
      end

      @og_image = images[:thumbnail]
      @og_title = @twitter_title = current_video.title
      @og_description = @twitter_description = "Watch #{current_channel.name} on Veue!"
    end
  end
end
