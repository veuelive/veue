# frozen_string_literal: true

require "system_helper"

# NOTE: These tests are trying to test a sequence that doesn't NORMALLY happen just
# within the rails app. This has to be combined with the real Electron App to get full / perfect results.
describe "Discover View" do
  def read_file(file)
    File.read(File.join("spec/support/buttercms/discover/#{file}"))
  end

  def stub_butter(slug:, data:)
    stub_request(:get, "https://api.buttercms.com/v2/pages/*/#{slug}/?auth_token=TEST_TOKEN&preview")
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
    let(:json_data) { read_file("kitchensink.json") }

    it "should show everything for root and non-root slugs" do
      paths = [
        {slug: "homepage-en", app_path: root_path},
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

        visit(hash[:app_path])

        expect(page).to have_title(data_fields["seo_title"])

        hero = data_components.find { |c| c["type"] == "hero_image" }
        hero_url = hero.dig("fields", "link")
        hero_image = hero.dig("fields", "image")

        expect(page).to have_css("a[href='#{hero_url}']")
        expect(page).to have_css("img[src='#{hero_image}']")

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

  describe "for static content" do
    let!(:video) { create(:vod_video) }
    let(:json_data) { read_file("static_curation.json") }

    before(:each) do
      stub_butter(slug: "homepage-en", data: json_data)
    end

    it "should show only static videos" do
      fields = data.dig("data", "fields")
      components = fields["components"]

      static_curation = components.find { |c| c["type"] == "static_curation" }
      static_video_id = static_curation.dig("fields", "videos").first["video_id"]
      video.update!(id: static_video_id)

      visit root_path

      expect(page).to have_text(static_curation.dig("fields", "title"))
      expect(page).to have_css("a[href*='#{video.id}']")
    end

    it "shouldnt show static videos if none found" do
      visit root_path

      expect(page).to have_no_text("Static")
      expect(page).to have_no_css("a[href*='#{video.id}']")
    end
  end

  describe "for dynamic content" do
    let(:json_data) { read_file("dynamic_curation.json") }

    before(:each) do
      stub_butter(slug: "homepage-en", data: json_data)
    end

    it "should show dynamic content" do
      live_limit = data_components.find { |c|
        c.dig("fields", "type") == "live"
      }.dig("fields", "max_size")
      live_limit = Integer(live_limit)

      # instantiate videos
      vod_videos = create_list(:vod_video, 5)
      create_list(:live_video, live_limit + 1)

      visit root_path

      live_video_title = data_components.find { |c| c.dig("fields", "type") == "live" }.dig("fields", "title")
      vod_video_title = data_components.find { |c|
        c.dig("fields", "type") == "popular-all-time"
      }.dig("fields", "title")
      expect(page).to have_text(live_video_title)
      expect(page).to have_text(vod_video_title)

      expect(page).to have_selector(".live", count: live_limit)
      vod_videos.each { |video| expect(page).to have_css("a[href*='#{video.id}']") }
    end

    it "should not show dynamic content if none found" do
      visit root_path

      live_video_title = data_components.find { |c| c.dig("fields", "type") == "live" }.dig("fields", "title")
      vod_video_title = data_components.find { |c|
        c.dig("fields", "type") == "popular-all-time"
      }.dig("fields", "title")
      expect(page).to have_no_text(live_video_title)
      expect(page).to have_no_text(vod_video_title)
    end
  end

  describe "for content" do
    let(:json_data) { read_file("content.json") }

    it "should not display content if none found" do
      stub_butter(slug: "homepage-en", data: {}.to_json)
      visit root_path

      content = data_components.find { |c| c["type"] == "content" }.dig("fields", "body")

      expect(page).to have_no_text(ActionView::Base.full_sanitizer.sanitize(content))
    end
  end

  describe "for hero image" do
    let(:json_data) { read_file("hero.json") }

    it "should not display if no image found" do
      stub_butter(slug: "homepage-en", data: {}.to_json)
      visit root_path

      hero = data_components.find { |c| c["type"] == "hero_image" }
      hero_url = hero.dig("fields", "link")
      hero_image = hero.dig("fields", "image")

      expect(page).to have_no_css("a[href='#{hero_url}']")
      expect(page).to have_no_css("img[src='#{hero_image}']")
    end
  end
end
