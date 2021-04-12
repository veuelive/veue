# frozen_string_literal: true

require "system_helper"

# NOTE: These tests are trying to test a sequence that doesn't NORMALLY happen just
# within the rails app. This has to be combined with the real Electron App to get full / perfect results.
describe "Discover View" do
  let(:featured_video) { create(:vod_video) }
  let(:curation_name) { Faker::Lorem.sentence(word_count: 2) }

  describe "curations" do
    before do
      stub_request(:get, "https://api.buttercms.com/v2/pages/*/homepage-en/?auth_token=TEST_TOKEN&preview")
        .with(
          headers: {
            Accept: "application/json",
          },
        )
        .to_return(status: 200,
                   body: {
                     data: {
                       slug: "homepage-en",
                       name: "Homepage en",
                       published: "2021-03-23T19:21:49.998204Z",
                       updated: "2021-03-23T20:03:10.850583Z",
                       page_type: nil,
                       fields: {
                         curations: [
                           {
                             type: "curation",
                             fields: {
                               curation_name: curation_name,
                               videos: [
                                 {
                                   video_title: "Featured Show",
                                   video_id: featured_video.id,
                                 },
                               ],
                             },
                           },
                           {
                             type: "curation",
                             fields: {
                               curation_name: "Empty Curation",
                               videos: [],
                             },
                           },
                         ],
                       },
                     },
                   }.to_json)
    end

    it "should show curations" do
      visit(root_path)

      # Show the valid curation
      expect(page).to have_content(curation_name)

      # This will be there twice because it's recent AND it's featured
      expect(page).to have_content(featured_video.title).twice

      # Don't show empty curations
      expect(page).to_not have_content("Empty Curation")

      # Also don't show the text "Featured Show" as that's the internal name to the CMS
      expect(page).to_not have_content("Featured Show")
    end
  end

  describe "video display times should display as relative" do
    # These happen so fast, we have to go backwards in time a little to make them display properly in test
    let(:one_minute_ago) { create(:vod_video, started_at_ms: 30.seconds.ago.utc.to_ms) }
    let(:two_minutes_ago) { create(:vod_video, started_at_ms: 1.minute.ago.utc.to_ms) }
    let(:one_hour_ago) { create(:vod_video, started_at_ms: 1.hour.ago.utc.to_ms) }
    let(:two_hours_ago) { create(:vod_video, started_at_ms: 2.hours.ago.utc.to_ms) }
    let(:one_day_ago) { create(:vod_video, started_at_ms: 1.day.ago.utc.to_ms) }
    let(:two_days_ago) { create(:vod_video, started_at_ms: 2.days.ago.utc.to_ms) }
    let(:one_week_ago) { create(:vod_video, started_at_ms: 1.week.ago.utc.to_ms) }
    let(:two_weeks_ago) { create(:vod_video, started_at_ms: 2.weeks.ago.utc.to_ms) }
    let(:one_month_ago) { create(:vod_video, started_at_ms: 1.month.ago.utc.to_ms) }
    let(:two_months_ago) { create(:vod_video, started_at_ms: 2.months.ago.utc.to_ms) }
    let(:one_year_ago) { create(:vod_video, started_at_ms: 12.months.ago.utc.to_ms) }
    let(:two_years_ago) { create(:vod_video, started_at_ms: 2.years.ago.utc.to_ms) }

    it "should show the proper relative times for each video" do
      videos = [
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

      visit(root_path)

      videos.each do |hash|
        video_card = find("##{dom_id(hash[:video])}")

        expect(video_card).to have_content(hash[:content])
      end
    end
  end
end
