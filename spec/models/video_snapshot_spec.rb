# frozen_string_literal: true

require "rails_helper"

RSpec.describe VideoSnapshot, type: :model do
  # has to be streamer to allow for channel creation
  let(:user) { create(:streamer) }
  let(:random_user) { create(:user) }
  let(:video) { create(:video, user: user, channel: user.channels.first) }

  describe "Ability testing on snapshots" do
    let!(:video_snapshot) { create(:video_snapshot, video: video) }

    it "Should allow a user who owns the video to manage a snapshot" do
      ability = Ability.new(user)
      expect(ability.can?(:manage, video_snapshot)).to eq(true)
      expect(ability.can?(:manage, video)).to eq(true)
    end

    it "Should not allow a user who does not own the video to read or manage snapshots" do
      ability = Ability.new(random_user)

      %i[manage create read update destroy].each do |action|
        expect(ability.cannot?(action, video_snapshot)).to eq(true)
      end
    end

    it "Should not allow an anonymous user to read or manage snapshots" do
      ability = Ability.new(nil)
      expect(ability.cannot?(:manage, video)).to eq(true)
      %i[manage create read update destroy].each do |action|
        expect(ability.cannot?(action, video_snapshot)).to eq(true)
      end
    end
  end
end
