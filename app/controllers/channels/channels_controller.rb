# frozen_string_literal: true

module Channels
  class ChannelsController < ApplicationController
    include ChannelConcern

    def index
    end

    def edit

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
  end
end
