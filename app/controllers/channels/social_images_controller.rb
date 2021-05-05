module Channels
  class SocialImagesController < ApplicationController
    def index
      primary_shot = current_video.primary_shot

      return unless primary_shot

      respond_to do |fmt|
        fmt.png { redirect_to(preview_image_url(snapshot: primary_shot)) }
      end
    end

    def current_video
      @current_video ||= Video.find(params[:video_id])
    end
    helper_method :current_video

    def current_channel
      @current_channel ||= Channel.friendly.find(params[:channel_id])
    end
    helper_method :current_channel

    private

    def preview_image_url(snapshot:)
      image_url_for(snapshot.variant(resize_to_limit: [500, 500]).processed)
    end
  end
end
