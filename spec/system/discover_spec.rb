# frozen_string_literal: true

require "system_helper"

# NOTE: These tests are trying to test a sequence that doesn't NORMALLY happen just
# within the rails app. This has to be combined with the real Electron App to get full / perfect results.
describe "Discover View" do
  let(:homepage_slug) { "default-homepage" }

  def read_file(file)
    File.read(File.join("spec/support/buttercms/discover/#{file}"))
  end

  def stub_butter(slug:, data:)
    stub_request(:get, "https://api.buttercms.com/v2/pages/*/#{slug}/?auth_token=TEST_TOKEN")
      .with(
        headers: {
          Accept: "application/json",
        },
      )
      .to_return(status: 200,
                 body: data)
  end

  let(:data) { JSON.parse(json_data) }
  let(:data_fields) { data.dig("data", "fields") }
  let(:data_components) { data_fields["components"] }

  describe "kitchensink" do
    let!(:vod_videos) { create_list(:vod_video, 5) }
    let!(:trending_videos) { create_list(:vod_video_with_video_views, 5, video_views_count: 5) }
    let!(:popular_videos) { create_list(:vod_video_with_video_views, 5, video_views_count: 5) }
    let!(:live_videos) { create_list(:live_video, 5) }
    let!(:upcoming_broadcasts) { create_list(:channel, 3, next_show_at: 3.days.since) }
    let(:json_data) { read_file("kitchensink.json") }

    it "should show everything for root and non-root slugs" do
      paths = [
        {slug: "default-homepage", app_path: root_path},
        {slug: "konnor", app_path: "/en/konnor"},
      ]

      trending_videos.each do |video|
        create_list(:video_view_minute, 5, video_view: video.video_views.first)
      end

      paths.each do |hash|
        stub_butter(slug: hash[:slug], data: json_data)

        # To allow for static curation to propagate
        static_curation = data_components.find { |c| c["type"] == "static_curation" }
        static_video_id = static_curation.dig("fields", "videos").first["video_id"]
        Video.first.update!(id: static_video_id)

        static_upcoming = data_components.find { |c| c["type"] == "static_upcoming" }
        static_upcoming_slug = static_upcoming.dig("fields", "upcoming_broadcasts").first["slug"]

        # This makes sure theres something to show for static content.
        upcoming_broadcasts.first.update!(slug: static_upcoming_slug)

        visit(hash[:app_path])

        # Seo Title
        expect(page).to have_title(data_fields["seo_title"])

        # Hero
        hero = data_components.find { |c| c["type"] == "hero_image" }
        hero_url = hero.dig("fields", "link")
        hero_image = hero.dig("fields", "image")

        expect(page).to have_css("a[href='#{hero_url}']")
        expect(page).to have_css("img[src='#{hero_image}']")

        # Find the titles for static / dynamic (curations|upcoming)
        # lets not try to find the elements.
        # Titles only show up if a colletion is found.
        data_components.each do |component|
          next if %w[content hero_image].include?(component["type"])

          title = component.dig("fields", "title")
          expect(page).to have_text(title)
        end

        content = data_components.find { |c| c["type"] == "content" }.dig("fields", "body")
        expect(page).to have_text(ActionView::Base.full_sanitizer.sanitize(content))
      end
    end
  end
end
