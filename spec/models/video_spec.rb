# frozen_string_literal: true

require "rails_helper"

RSpec.describe Video, type: :model do
  let(:video) { create(:video) }
  let(:user) { video.user }
  let(:random_user) { create(:user) }
  let(:admin_user) { create(:admin) }

  describe "scheduling" do
    it "should allow you to set a time in the future" do
      expect(video).to be_pending
      tomorrow = 1.day.from_now
      video.update!(scheduled_at: tomorrow)
      expect(video).to be_scheduled
      expect(Video.scheduled.count).to eq(1)
      expect(video.scheduled_at).to eq(tomorrow)
      expect(Video.stale.count).to eq(0)
    end

    it "should you allow to cancel scheduling" do
      tomorrow = 1.day.from_now
      video.update!(scheduled_at: tomorrow)
      expect(video).to be_scheduled
      video.update!(scheduled_at: nil)
      expect(video).to_not be_scheduled
      expect(video.scheduled_at).to be_nil
      expect(Video.stale.count).to eq(0)
    end

    it "should allow you to start a scheduled video" do
      one_week_from_now = 1.week.from_now
      video.update!(scheduled_at: one_week_from_now)
      video.start!
      expect(video.scheduled?).to be(false)
      expect(video.live?).to be(true)
      expect(Video.stale.count).to eq(0)
    end

    it "should not allow you to schedule in the past" do
      yesterday = 1.day.ago
      expect { video.update!(scheduled_at: yesterday) }.to raise_error(ActiveRecord::RecordInvalid)
    end

    it "should not allow you to schedule unschedulable videos" do
      video.finish!
      expect { video.update!(scheduled_at: 1.day.from_now) }.to raise_error(ActiveRecord::RecordInvalid)
    end

    it "should expire old scheduled videos" do
      video.update!(scheduled_at: 1.minute.from_now)
      Timecop.travel(40.minutes.from_now)
      expect(Video.stale.count).to eq(0)
      expect(Video.scheduled.count).to eq(1)

      # Okay, we should be very stale now
      Timecop.travel(1.hour.from_now)
      expect(Video.stale.count).to eq(1)

      # It's still scheduled as that's a state, but the CRON job will catch it if `stale`
      expect(Video.scheduled.count).to eq(1)
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

  describe "Webhooks" do
    let(:payload_fixture) { File.read(Rails.root.join("spec/support/webhooks/1596476546-live_stream_completed.json")) }
    let(:payload) { JSON.parse(payload_fixture, symbolize_names: true) }

    it "should add a duration to a video on successfully ending a video" do
      expect(video.duration).to be_nil
      Phenix::Webhooks.ended_payload(video, payload)

      duration = (payload.dig(:data, :duration) / 1000).ceil
      expect(video.duration).to eq(duration)
    end

    it "does not rewrite the duration with nil" do
      duration = 45
      video.update!(duration: duration)
      payload[:data][:duration] = nil
      Phenix::Webhooks.ended_payload(video, payload)
      expect(video.duration).to eq(duration)
    end

    it "should add an end_reason on successfully ending a video" do
      expect(video.end_reason).to be_nil
      Phenix::Webhooks.ended_payload(video, payload)
      expect(video.end_reason).to eq(payload.dig(:data, :end_reason))
    end

    it "should not overwrite an end_reason with nil" do
      reason = "stream stopped"
      video.update!(end_reason: reason)
      payload[:data][:end_reason] = nil
      Phenix::Webhooks.ended_payload(video, payload)
      expect(video.end_reason).to eq(reason)
    end
  end

  describe "Snapshots" do
    let(:snapshot_one) { create(:video_snapshot, priority: 1) }
    let(:snapshot_two) { create(:video_snapshot, priority: 2) }

    it "Should attach priorty 1 snapshots as primary" do
      video.attach_initial_shot!(snapshot_one)

      expect(video.primary_shot.blob).to eq(snapshot_one.image.blob)
      expect(video.secondary_shot.blob).to be_nil
    end

    it "Should only attach priority 2 snapshots as secondary" do
      video.attach_initial_shot!(snapshot_two)

      expect(video.secondary_shot.blob).to eq(snapshot_two.image.blob)
      expect(video.primary_shot.blob).to be_nil
    end

    it "should allow you to remove a secondary screenshot" do
      video.attach_secondary_shot!(snapshot_two)

      expect(snapshot_two.secondary_shot?(video)).to eq(true)

      video.purge_or_attach_secondary_shot!(snapshot_two)

      expect(snapshot_two.secondary_shot?(video)).to eq(false)
    end
  end

  describe "popular queries" do
    let!(:video_one) { create(:vod_video_with_video_views, video_views_count: 2) }
    let!(:video_two) { create(:vod_video_with_video_views, video_views_count: 1) }
    let!(:video_three) { create(:vod_video_with_video_views, video_views_count: 5) }
    let!(:video_four) { create(:vod_video_with_video_views, video_views_count: 4) }

    it "should sort by most popular all time based on views" do
      correct_order = [video_three, video_four, video_one, video_two]
      popular_all_time = Video.popular_all_time

      correct_order.each_with_index do |video, index|
        expect(video).to eq(popular_all_time[index])
      end
    end

    it "should sort by most popular in the last week based on when views were created" do
      correct_order = [video_four, video_three, video_one, video_two]

      video_three.video_views.limit(2).each do |video_view|
        video_view.update!(created_at: 2.weeks.ago)
      end

      popular_this_week = Video.popular_this_week

      correct_order.each_with_index do |video, index|
        expect(video).to eq(popular_this_week[index])
      end
    end

    it "should sort by most popular in the last month based on when views were created" do
      correct_order = [video_four, video_three, video_one, video_two]

      video_three.video_views.limit(2).each do |video_view|
        video_view.update!(created_at: 2.months.ago)
      end

      popular_this_month = Video.popular_this_month

      correct_order.each_with_index do |video, index|
        expect(video).to eq(popular_this_month[index])
      end
    end
  end
end
