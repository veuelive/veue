# frozen_string_literal: true

require "rails_helper"

RSpec.describe AttachInitialSnapshotsJob, type: :job do
  let(:video) { create(:live_video) }
  let(:original_snapshot) { create(:video_snapshot, video: video) }
  let!(:primary_snapshot) { create(:video_snapshot, video: video, timecode: 1) }
  let!(:secondary_snapshot) { create(:video_snapshot, video: video, timecode: 1, priority: 2) }

  it "should attach both a primary and secondary shot" do
    AttachInitialSnapshotsJob.perform_now(video)
    expect(primary_snapshot).to be_primary_shot(video)
    expect(secondary_snapshot).to be_secondary_shot(video)
  end

  it "should attach only a primary shot if no priority 1 found within first 25 seconds" do
    primary_snapshot.update!(timecode: 35)
    AttachInitialSnapshotsJob.perform_now(video)
    expect(secondary_snapshot).to be_primary_shot(video)
  end

  it "should not attach anything if no snapshots found" do
    primary_snapshot.update!(timecode: 35)
    secondary_snapshot.update!(timecode: 35)

    AttachInitialSnapshotsJob.perform_now(video)

    expect(primary_snapshot).not_to(be_primary_shot(video))
    expect(secondary_snapshot).not_to(be_primary_shot(video))
    expect(secondary_snapshot).not_to(be_secondary_shot(video))
  end

  it "should not attempt to attach anything if a primary shot is already in place" do
    video.attach_primary_shot!(original_snapshot)
    AttachInitialSnapshotsJob.perform_now(video)
    expect(original_snapshot).to be_primary_shot(video)

    # Should not attempt to attach these.
    expect(primary_snapshot).not_to(be_primary_shot(video))
    expect(secondary_snapshot).not_to(be_secondary_shot(video))
  end
end
