# frozen_string_literal: true

class FollowsController < ApplicationController
  before_action :authenticate_user!, only: %i[create destroy]

  def create
    return render_streamer_profile if current_video.user.followers.include?(current_user)

    current_video.user.streamer_follows.create!(streamer_follow: current_user)
    render_streamer_profile
  end

  def destroy
    current_video.user.streamer_follows.where(streamer_follow: current_user).each(&:unfollow!)
    render_streamer_profile
  end

  private

  def current_video
    @current_video ||= Video.find(params[:video_id])
  end
  helper_method :current_video

  def render_streamer_profile
    render(
      partial: "videos/partials/streamer_profile",
      content_type: "html",
    )
  end
end
