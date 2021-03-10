# frozen_string_literal: true

require "rails_helper"

describe ContentController do
  # This actually issues the request and
  # we expect a Test page to exist
  describe "ButterCMS Integration" do
    it "should return a 404 for a non-existant page" do
      allow(ButterCMS::Page).to(receive(:get)) {
        raise(ButterCMS::NotFound)
      }

      get "/en/do-not-create-me"
      expect(response).to have_http_status(:not_found)
    end

    describe "a complex page with seo settings" do
      it "should override page headers with content" do
        mock_page_with_file("landing-page", "seo_optimized")
        get "/en/landing-page"

        expect(response).to have_http_status(:ok)
        render_template "contents/show"

        expect(response.body).to include("seo title")
        expect(response.body).to include("seo description")

        expect(response.body).to include("og title")
        expect(response.body).to include("og description")
        expect(response.body).to include("og image")

        expect(response.body).to include("twitter title")
        expect(response.body).to include("twitter description")
        expect(response.body).to include("twitter image")

        expect(response.body).to include(
          "<h1>Heading</h1>
<p><strong>Strong</strong></p>",
        )
      end
    end

    describe "a simple page with no overrides" do
      it "should leave the headers alone!" do
        mock_page_with_file("simple", "simple")

        # This will cause all t() helpers to return their own key name
        do_not_translate

        get "/en/simple"

        # Since we aren't overriding anything, we should have all our default I8tn translation keys
        expect(response.body).to include("header.seo.default_title")
        expect(response.body).to include("header.seo.default_description")
        expect(response.body).to include("header.twitter.default_title")
        expect(response.body).to include("header.twitter.default_description")
        expect(response.body).to include("header.twitter.default_image")
        expect(response.body).to include("header.og.default_title")
        expect(response.body).to include("header.og.default_description")
        expect(response.body).to include("header.og.default_image")
      end
    end
  end

  def mock_page_with_file(page_name, json_name)
    stub_request(:get, "https://api.buttercms.com/v2/pages/company_content/#{page_name}/?auth_token=TEST_TOKEN")
      .with(
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip;q=1.0,deflate;q=0.6,identity;q=0.3",
          "User-Agent": "ButterCMS/Ruby 1.8",
        },
      )
      .to_return(status: 200,
                 body: File.open(
                   Rails.root.join("spec/support/buttercms/#{json_name}.json"),
                 ),
                 headers: {})
  end
end
