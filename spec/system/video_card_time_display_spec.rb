# frozen_string_literal: true

require "system_helper"

describe "Video Card time displays should display as relative" do
  let(:channel) { create(:channel) }

  # This is too hard to capture 1 minute vs 2 minutes and requires stubbing the browser time.
  # Timecop and Rails' built in timecop do not affect the browser time, only the server time.
  # As it is, this is more of a visual regression test since the actual times are handled
  # by a web component.
  let(:five_minutes_ago) { create(:vod_video, started_at_ms: 5.minutes.ago.to_ms, channel: channel) }
  let(:one_hour_ago) { create(:vod_video, started_at_ms: 1.hour.ago.to_ms, channel: channel) }
  let(:two_hours_ago) { create(:vod_video, started_at_ms: 2.hours.ago.to_ms, channel: channel) }
  let(:one_day_ago) { create(:vod_video, started_at_ms: 1.day.ago.to_ms, channel: channel) }
  let(:two_days_ago) { create(:vod_video, started_at_ms: 2.days.ago.to_ms, channel: channel) }
  let(:one_week_ago) { create(:vod_video, started_at_ms: 1.week.ago.to_ms, channel: channel) }
  let(:two_weeks_ago) { create(:vod_video, started_at_ms: 2.weeks.ago.to_ms, channel: channel) }
  let(:one_month_ago) { create(:vod_video, started_at_ms: 1.month.ago.to_ms, channel: channel) }
  let(:two_months_ago) { create(:vod_video, started_at_ms: 2.months.ago.to_ms, channel: channel) }
  let(:one_year_ago) { create(:vod_video, started_at_ms: 12.months.ago.to_ms, channel: channel) }
  let(:two_years_ago) { create(:vod_video, started_at_ms: 2.years.ago.to_ms, channel: channel) }

  let(:videos) {
    [
      {video: five_minutes_ago, content: /\d+ minutes ago/},
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
  }

  it "should show the proper relative times for each video on the discover page" do
    # instantiate videos
    videos

    visit(root_path)

    videos.each do |hash|
      video_card = find("##{dom_id(hash[:video])}")

      expect(video_card).to have_content(hash[:content])
    end
  end

  it "should show the proper relative times for each video on a channel page" do
    # instantiate videos
    videos
    visit(channel_path(channel))

    videos.each do |hash|
      video_card = find("##{dom_id(hash[:video])}")

      expect(video_card).to have_content(hash[:content])
    end
  end
end
