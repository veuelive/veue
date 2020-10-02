# frozen_string_literal: true

class FollowsController < ApplicationController
  before_action :authenticate_user!, only: %i[create destroy]
  before_action :set_video, only: %i[create destroy]
  before_action :set_follow, only: %i[destroy]

  def create
    @follow = set_follow_by_user || build_follow
    @follow.persisted? ? @follow.update(unfollowed_at: nil) : @follow.save

    unless @follow.valid?
      return render(json: {success: false, error_messages: @follow.errors.full_messages})
    end

    render_streamer_profile
  end

  def destroy
    unless @follow.update(unfollowed_at: DateTime.now)
      return render(json: {success: false, error_messages: follow.errors.full_messages})
    end

    render_streamer_profile
  end

  private

  def set_follow
    @follow ||= Follow.find(params[:id])
  end

  def set_follow_by_user
    @follow ||= Follow.find_by(
      streamer_user_id: @video.user.to_param,
      follower_user_id: current_user.to_param
    )
  end

  def set_video
    @video ||= Video.find(params[:video_id])
  end

  def build_follow
    Follow.new(
      streamer_user_id: @video.user.to_param,
      follower_user_id: current_user.to_param
    )
  end

  def render_streamer_profile
    render(
      partial: "videos/partials/streamer_profile",
      locals: { current_video: @video },
      content_type: "html"
    )
  end
end
