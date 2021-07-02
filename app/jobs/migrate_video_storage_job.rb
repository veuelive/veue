# frozen_string_literal: true

class MigrateVideoStorageJob < ApplicationJob
  queue_as :default

  sidekiq_options retry: 5

  def perform(video_id=nil)
    if video_id.blank?
      ids = Video.not_migrated.ids

      ids.each { |id| MigrateVideoStorageJob.perform_later(id) }
      return
    end

    video = Video.find_by(id: video_id)

    return if video.blank?
    return if video.mp4_video.attached?

    video.migrate_to_mp4
  end
end
