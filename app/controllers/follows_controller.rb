# frozen_string_literal: true

class FollowsController < ApplicationController
  before_action :authenticate_user!, only: %i[create destroy]
  before_action :set_video, only: %i[create destroy]
  before_action :current_follow, only: %i[destroy]

  def create
    @current_follow = follow_by_user || build_follow
    @current_follow.persisted? ? @current_follow.update!(unfollowed_at: nil) : @current_follow.save!
    unless @current_follow.valid?
      render(json: {success: false, error_messages: @current_follow.errors.full_messages})
      return
    end

    render_streamer_profile
  end

  def destroy
    unless @current_follow.update(unfollowed_at: Time.current)
      return render(json: {success: false, error_messages: @current_follow.errors.full_messages})
    end

    render_streamer_profile
  end

  private

  def current_follow
    @current_follow ||= Follow.find(params[:id])
  end

  def follow_by_user
    @follow_by_user ||= Follow.find_by(
      streamer_user_id: @video.user.to_param,
      follower_user_id: current_user.to_param,
    )
  end

  def set_video
    @video = Video.find(params[:video_id])
  end

  def build_follow
    Follow.new(
      streamer_user_id: @video.user.to_param,
      follower_user_id: current_user.to_param,
    )
  end

  def render_streamer_profile
    render(
      partial: "videos/partials/streamer_profile",
      locals: {current_video: @video},
      content_type: "html",
    )
  end
end
