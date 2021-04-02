# frozen_string_literal: true

module Channels
  class VideoSnapshotsController < ApplicationController
    include ChannelConcern

    def index
      authorize!(:manage, current_video)
    end

    def show; end

    def find
      timecode = parse_timecode(params[:t])

      snapshot_hash = snapshot_hash_from_timecode(timecode)

      respond_to do |fmt|
        fmt.json { render(json: snapshot_hash.to_json) }
      end
    end

    def create
      authorize!(:manage, current_video)

      snapshot = VideoSnapshot.create!(snapshot_params.except(:channel_id))

      attach_default_shots(snapshot)

      render(json: {success: true})
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
      params.permit(:timecode, :image, :device_type, :device_id, :video_id, :channel_id, :priority)
    end

    def attach_default_shots(snapshot)
      if !current_video.primary_shot.attached? && snapshot.priority == 1
        attach_primary_shot(snapshot)
      elsif !current_video.secondary_shot.attached? && snapshot.priority == 2
        attach_secondary_shot(snapshot)
      end
    end

    def attach_primary_shot(snapshot)
      current_video.primary_shot.attach(snapshot.image.blob)
    end

    def attach_secondary_shot(snapshot)
      current_video.secondary_shot.attach(snapshot.image.blob)
    end

    def snapshot_hash_from_timecode(timecode)
      snapshot = find_snapshot_at_timecode(timecode)

      snapshot_hash = {}
      # Use instance variables in case @current_snapshot ends up being nil
      url = url_for(snapshot.image.variant(resize_to_limit: [200, 112])) if snapshot&.image&.attached?

      # Send the ID to be able to test the image
      snapshot_hash[:url] = url if url
      snapshot_hash[:id] = snapshot.id if snapshot
      snapshot_hash
    end

    # Give a 2 seconds buffer for screenshots (30_000 is actual interval)
    # This is used for positive look ahead and negative look behind
    def find_snapshot_at_timecode(timecode, interval: 32_000)
      min = timecode - interval
      max = timecode + interval
      @current_snapshot = current_video.video_snapshots
                                       .find_all_between(min: min, max: max)
                                       .first
    end

    def parse_timecode(timecode)
      timecode = 0 if timecode == "NaN" || timecode.blank?
      Integer(timecode) * 1000
    end
  end
end
