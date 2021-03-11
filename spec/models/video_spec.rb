# frozen_string_literal: true

require "rails_helper"

RSpec.describe Video, type: :model do
  describe "scheduling" do
    let(:video) { create(:video) }
    let(:user) { video.user }

    it "should allow you to set a time in the future" do
      expect(video).to be_pending
      tomorrow = 1.day.from_now
      video.update!(scheduled_at: tomorrow)
      expect(video).to be_scheduled
      expect(Video.scheduled.count).to eq(1)
      expect(video.scheduled_at).to eq(tomorrow)
    end

    it "should you allow to cancel scheduling" do
      tomorrow = 1.day.from_now
      video.update!(scheduled_at: tomorrow)
      expect(video).to be_scheduled
      video.update!(scheduled_at: nil)
      expect(video).to_not be_scheduled
      expect(video.scheduled_at).to be_nil
    end

    it "should allow you to start a scheduled video" do
      one_week_from_now = 1.week.from_now
      video.update!(scheduled_at: one_week_from_now)
      video.start!
      expect(video.scheduled?).to be(false)
      expect(video.starting?).to be(true)
    end

    it "should not allow you to schedule in the past" do
      yesterday = 1.day.ago
      expect { video.update!(scheduled_at: yesterday) }.to raise_error(ActiveRecord::RecordInvalid)
    end

    it "should not allow you to schedule unschedulable videos" do
      video.finish!
      expect { video.update!(scheduled_at: 1.day.from_now) }.to raise_error(ActiveRecord::RecordInvalid)
    end
  end
end
