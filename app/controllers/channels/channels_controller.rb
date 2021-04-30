# frozen_string_literal: true

module Channels
  class ChannelsController < ApplicationController
    include ChannelConcern

    before_action :authenticate_user!, only: %i[index edit]

    def index
      @channels = current_user.channels
    end

    def edit
      @channel = current_user.channels.find(params[:channel_id])
      if request.xhr? || request.format.js?
        render(template: "channels/channels/partials/_edit_form", layout: false)
      else
        @channels = current_user.channels
      end
    end

    def update
      @channel = current_user.channels.find(params[:channel_id])

      if @channel.update(permitted_parameters)
        render(status: :accepted, template: "channels/channels/partials/_edit_form", layout: false)
      else
        render(status: :bad_request, template: "channels/channels/partials/_edit_form", layout: false)
      end
    end

    def upload_image
      @channel = current_user.channels.find(params[:id])

      if @channel.update(params.permit(:channel_icon))
        render(partial: "channels/channels/partials/channel_icon", locals: {channel: @channel})
      else
        render(status: :bad_request, json: "")
      end
    end

    def destroy_image
      @channel = current_user.channels.find(params[:id])

      @channel.channel_icon.purge
      render(partial: "channels/channels/partials/channel_icon", locals: {channel: @channel})
    end

    def show
      setup_tags
    end

    def viewed
      live_video = current_channel.videos.active.first
      return unless live_video

      VideoView.process_view!(live_video, current_user, params[:minute], user_fingerprint, true)
    end

    private

    def setup_tags
      setup_seo_tags
      setup_twitter_tags
      setup_og_tags
    end

    def setup_og_tags
      @og_title = I18n.t("channels.og.title", name: current_channel.name)
      @og_description = current_channel.about.presence
      @og_image = current_channel.social_image(1200, 630)
    end

    def setup_twitter_tags
      @twitter_title = I18n.t("channels.twitter.title", name: current_channel.name)
      @twitter_description = current_channel.about.presence
      @twitter_image = current_channel.social_image(120, 120)
    end

    def setup_seo_tags
      @seo_title = I18n.t("channels.seo.title", name: current_channel.name)
      @seo_description = current_channel.about.presence
    end

    def permitted_parameters
      params.require(:channel).permit(:name, :bio)
    end
  end
end
