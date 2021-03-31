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
end
