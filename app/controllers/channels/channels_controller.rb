# frozen_string_literal: true

module Channels
  class ChannelsController < ApplicationController
    include ChannelConcern
    load_and_authorize_resource

    def index; end

    def edit
      render(template: "channels/channels/partials/_edit_form", layout: false) && return if xhr_request?
    end

    def update
      if @channel.update(permitted_parameters)
        render(status: :accepted, template: "channels/channels/partials/_edit_form", layout: false)
      else
        render(status: :bad_request, template: "channels/channels/partials/_edit_form", layout: false)
      end
    end

    def upload_image
      if @channel.update(params.permit(:channel_icon))
        render(partial: "channels/channels/partials/channel_icon", locals: {channel: @channel})
      else
        render(status: :bad_request, json: "")
      end
    end

    def destroy_image
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

    def current_user_channels
      @current_user_channels ||= current_user.channels.each(&:decorate)
    end
    helper_method :current_user_channels

    def permitted_parameters
      params.require(:channel).permit(:name, :description, :tagline, :schedule_day, :schedule_type, :schedule_timezone, :schedule_minutes)
    end
  end
end
