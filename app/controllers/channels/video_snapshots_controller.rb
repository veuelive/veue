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

      if !current_video.primary_shot.attached?
        attach_primary_shot(snapshot)
      elsif !current_video.secondary_shot.attached?
        attach_secondary_shot(snapshot)
      end

      render(json: {success: true})
    end

    def show
      respond_to do |fmt|
        fmt.jpg do
          timecode = Integer(params[:timecode])
          @current_snapshot = current_video.video_snapshots.find_at_timecode(timecode)

          redirect_to(@current_snapshot.preview_url) if @current_snapshot
        end
      end
    end

    def update
      authorize!(:manage, current_snapshot)

      attach_primary_shot(current_snapshot) if params[:commit] == "primary"
      attach_secondary_shot(current_snapshot) if params[:commit] == "secondary"

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
      params.permit(:timecode, :image, :device_type, :device_id, :video_id, :channel_id)
    end

    def attach_primary_shot(snapshot)
      current_video.primary_shot.attach(snapshot.image.blob)
    end

    def attach_secondary_shot(snapshot)
      current_video.secondary_shot.attach(snapshot.image.blob)
    end
  end
end
