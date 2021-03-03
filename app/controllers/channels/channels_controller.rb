# frozen_string_literal: true

module Channels
  class ChannelsController < ApplicationController
    include ChannelConcern

    def show; end

    def viewed
      live_video = current_channel.videos.active.first
      return unless live_video

      VideoView.process_view!(live_video, current_user, params[:minute], user_fingerprint, true)
    end
  end
end
