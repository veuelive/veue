# frozen_string_literal: true

module Channels
  class VideoSnapshotsController < ApplicationController
    include ChannelConcern

    def index
      authorize!(:manage, current_video)
    end

    def create
      authorize!(:manage, current_video)

      snapshot = VideoSnapshot.create!(snapshot_params.except(:channel_id))

      current_video.attach_initial_shot!(snapshot)

      render(json: {success: true})
    end

    def show
      return unless params[:format] == "jpg"

      timecode = Integer(params[:timecode])
      @current_snapshot = current_video.video_snapshots.find_at_timecode(timecode)

      redirect_to(@current_snapshot.preview_url) if @current_snapshot
    end

    def update
      authorize!(:manage, current_snapshot)

      current_video.attach_primary_shot!(current_snapshot) if params[:commit] == "primary"
      current_video.attach_secondary_shot!(current_snapshot) if params[:commit] == "secondary"

      render(action: "index", layout: false)
    end

    def current_video
      @current_video ||= Video.find(params[:video_id])
    end
    helper_method :current_video

    def current_channel
      @current_channel ||= Channel.friendly.find(params[:channel_id])
    end
    helper_method :current_channel

    def current_snapshot
      @current_snapshot ||= VideoSnapshot.find(params[:id])
    end
    helper_method :current_snapshot

    private

    def snapshot_params
      params.permit(:timecode, :image, :device_type, :device_id, :priority, :video_id, :channel_id)
    end
  end
end
