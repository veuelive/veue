# frozen_string_literal: true

require "rails_helper"

RSpec.describe Video, type: :model do
  let(:video) { create(:video) }
  let(:user) { video.user }
  let(:random_user) { create(:user) }
  let(:admin_user ) { create(:admin) }

  describe "scheduling" do
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

  describe "authorization" do
    it "Should allow a user to manage their own video and admins to manage any video" do
      abilities = [Ability.new(user), Ability.new(admin_user)]

      abilities.each do |ability|
        %i[manage create read update destroy].each do |action|
          expect(ability.can?(action, video)).to eq(true)
        end
      end
    end

    it "Should not allow a non-admin users to manage someone else's video" do
      abilities = [Ability.new(random_user), Ability.new(nil)]

      abilities.each do |ability|
        # A random / non-user should be able to only read the video.
        expect(ability.can?(:read, video)).to eq(true)

        # A random user cannot
        %i[manage create update destroy].each do |action|
          expect(ability.cannot?(action, video)).to eq(true)
        end
      end
    end
  end
end
