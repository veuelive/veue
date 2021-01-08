# frozen_string_literal: true

module Channels
  class ChannelsController < ApplicationController
    include ChannelConcern

    def show; end

    def viewed
      live_video = current_channel.videos.live.first
      return unless live_video

      VideoView.process_view!(live_video, current_user, request)
    end
  end
end
