# frozen_string_literal: true

module Channels
  class FollowsController < ApplicationController
    include ChannelConcern
    before_action :authenticate_user!, only: %i[create destroy]

    def show
      render_streamer_profile
    end

    def create
      current_user.follows.create!(channel: current_channel) unless current_channel.followers.include?(current_user)

      render_streamer_profile
    end

    def destroy
      current_channel.follows.where(user: current_user).each(&:unfollow!)
      render_streamer_profile
    end

    private

    def render_streamer_profile
      render(
        partial: "channels/videos/partials/streamer_profile",
        content_type: "html",
      )
    end
  end
end
