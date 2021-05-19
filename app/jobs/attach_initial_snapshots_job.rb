class AttachInitialSnapshotsJob < ApplicationJob
  queue_as :default

  def perform(video)
    snapshots = video.video_snapshots.past_snapshots(25)

    video.attach_initial_shots!(snapshots)
  end
end
