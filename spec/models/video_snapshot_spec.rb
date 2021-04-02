# frozen_string_literal: true

require "rails_helper"

RSpec.describe VideoSnapshot, type: :model do
  # has to be streamer to allow for channel creation
  let(:user) { create(:streamer) }
  let(:random_user) { create(:user) }
  let(:video) { create(:video, user: user, channel: user.channels.first) }

  describe "Timecode testing" do
    let!(:first_snapshot) { create(:video_snapshot, video: video, timecode: 0, priority: 2) }
    let!(:second_snapshot) { create(:video_snapshot, video: video, timecode: 30_000) }
    let!(:third_snapshot) { create(:video_snapshot, video: video, timecode: 60_000) }

    it "Should show the first snapshot from 0 - 30 seconds even with a priority 2" do
      snapshot = video.video_snapshots.find_all_between(min: -24_000, max: 32_000).first
      expect(snapshot).to eq(first_snapshot)
    end

    it "Should show the second snapshot when looking from 29 - 62 seconds" do
      snapshot = video.video_snapshots.find_all_between(min: 29_000, max: 62_000).first
      expect(snapshot).to eq(second_snapshot)
    end
  end

  describe "Ability testing on snapshots" do
    let!(:video_snapshot) { create(:video_snapshot, video: video) }

    it "Should allow a user who owns the video to manage a snapshot" do
      ability = Ability.new(user)
      expect(ability.can?(:manage, video_snapshot)).to eq(true)
      expect(ability.can?(:manage, video)).to eq(true)
    end

    it "Should not allow a user who does not own the video to read or manage snapshots" do
      ability = Ability.new(random_user)

      expect(ability.can?(:read, video_snapshot)).to eq(true)

      %i[manage create update destroy].each do |action|
        expect(ability.cannot?(action, video_snapshot)).to eq(true)
      end
    end

    it "Should not allow an anonymous user to read or manage snapshots" do
      ability = Ability.new(nil)
      expect(ability.cannot?(:manage, video)).to eq(true)

      expect(ability.can?(:read, video_snapshot)).to eq(true)

      %i[manage create update destroy].each do |action|
        expect(ability.cannot?(action, video_snapshot)).to eq(true)
      end
    end
  end
end
