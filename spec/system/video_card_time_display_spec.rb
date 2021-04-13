# frozen_string_literal: true

require "system_helper"

describe "Video Card time displays should display as relative" do
  let(:channel) { create(:channel) }
  # These happen so fast, we have to go backwards in time a little to make them display properly in test
  let(:one_minute_ago) { create(:vod_video, started_at_ms: 30.seconds.ago.utc.to_ms, channel: channel) }
  let(:two_minutes_ago) { create(:vod_video, started_at_ms: 1.minute.ago.utc.to_ms, channel: channel) }
  let(:one_hour_ago) { create(:vod_video, started_at_ms: 1.hour.ago.utc.to_ms, channel: channel) }
  let(:two_hours_ago) { create(:vod_video, started_at_ms: 2.hours.ago.utc.to_ms, channel: channel) }
  let(:one_day_ago) { create(:vod_video, started_at_ms: 1.day.ago.utc.to_ms, channel: channel) }
  let(:two_days_ago) { create(:vod_video, started_at_ms: 2.days.ago.utc.to_ms, channel: channel) }
  let(:one_week_ago) { create(:vod_video, started_at_ms: 1.week.ago.utc.to_ms, channel: channel) }
  let(:two_weeks_ago) { create(:vod_video, started_at_ms: 2.weeks.ago.utc.to_ms, channel: channel) }
  let(:one_month_ago) { create(:vod_video, started_at_ms: 1.month.ago.utc.to_ms, channel: channel) }
  let(:two_months_ago) { create(:vod_video, started_at_ms: 2.months.ago.utc.to_ms, channel: channel) }
  let(:one_year_ago) { create(:vod_video, started_at_ms: 12.months.ago.utc.to_ms, channel: channel) }
  let(:two_years_ago) { create(:vod_video, started_at_ms: 2.years.ago.utc.to_ms, channel: channel) }

  before(:each) do
    @videos = [
      {video: one_minute_ago, content: /1 minute ago/},
      {video: two_minutes_ago, content: /2 minutes ago/},
      {video: one_hour_ago, content: /1 hour ago/},
      {video: two_hours_ago, content: /2 hours ago/},
      {video: one_day_ago, content: /yesterday/},
      {video: two_days_ago, content: /2 days ago/},
      {video: one_week_ago, content: /7 days ago/},
      {video: two_weeks_ago, content: /14 days ago/},
      {video: one_month_ago, content: /last month/},
      {video: two_months_ago, content: /2 months ago/},
      {video: one_year_ago, content: /12 months ago/},
      {video: two_years_ago, content: /2 years ago/},
    ]
  end

  it "should show the proper relative times for each video on the discover page" do
    visit(root_path)

    @videos.each do |hash|
      video_card = find("##{dom_id(hash[:video])}")

      expect(video_card).to have_content(hash[:content])
    end
  end

  it "should show the proper relative times for each video on the discover page" do
    visit(channel_path(channel))

    @videos.each do |hash|
      video_card = find("##{dom_id(hash[:video])}")

      expect(video_card).to have_content(hash[:content])
    end
  end
end
