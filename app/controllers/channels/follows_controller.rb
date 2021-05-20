# frozen_string_literal: true

module Channels
  class FollowsController < ApplicationController
    include ChannelConcern
    before_action :authenticate_user!, only: %i[create destroy]

    def show
      render_channel_bar
    end

    def create
      current_user.follows.create!(channel: current_channel) unless current_channel.followers.include?(current_user)

      render_channel_bar
    end

    def destroy
      current_channel.follows.where(user: current_user).each(&:unfollow!)
      render_channel_bar
    end

    private

    def render_channel_bar
      render(
        partial: "channels/videos/partials/channel_bar",
        content_type: "html",
      )
    end
  end
end
