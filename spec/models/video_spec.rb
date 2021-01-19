# frozen_string_literal: true

require "rails_helper"

RSpec.describe Video, type: :model do
  describe "scheduling" do
    let(:video) { create(:video) }
    let(:user) { video.user }

    it "should allow you to set a time in the future" do
      expect(video).to be_pending
      tomorrow = 1.day.from_now
      video.schedule_for!(tomorrow)
      expect(video).to be_scheduled
      expect(Video.scheduled.count).to eq(1)
      expect(video.scheduled_at).to eq(tomorrow)
    end
  end
end
