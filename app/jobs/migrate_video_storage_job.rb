# frozen_string_literal: true

class MigrateVideoStorageJob < ApplicationJob
  queue_as :default

  def perform(video_id)
    video = Video.find(video_id)

    return if video.hls_video.attached? && video.dash_video.attached?

    video.migrate_to_storage
  end
end
