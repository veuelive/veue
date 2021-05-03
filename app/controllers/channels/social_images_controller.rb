module Channels
  class SocialImagesController < ApplicationController
    def index
      primary_shot = current_video.primary_shot

      return unless primary_shot

      profile_image = current_video.user.profile_image

      respond_to do |fmt|
        fmt.png { redirect_to(preview_image_url(snapshot: primary_shot, profile_image: profile_image)) }
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

    def preview_image_url(snapshot:, profile_image:)
      profile_image_variant = profile_image.variant(resize_and_pad: [200, 200, {background: "red"}])
      snapshot_variant = snapshot.variant(resize_and_pad: [500, 500, {background: "blue"}],
                                          composite: [profile_image_variant, {geometry: "+5+10"}])

      # snapshot_variant = snapshot.variant(combine: profile_image_variant)
      Router.url_for(snapshot_variant)
    end
  end
end
