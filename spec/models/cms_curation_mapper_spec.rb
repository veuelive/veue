# frozen_string_literal: true

require "rails_helper"

RSpec.describe CmsCurationMapper do
  let(:data_mapping) { CmsCurationMapper.new(data) }

  let!(:video_one) { create(:vod_video, started_at_ms: Integer(3.hours.ago) * 1000) }
  let!(:video_two) { create(:vod_video, started_at_ms: Integer(1.hour.ago) * 1000) }

  describe "for static curations" do
    let(:title) { "my static curation" }
    let(:data) {
      {
        type: "static_curation",
        fields: {
          title: title,
          display_type: "grid",
          videos: [
            {video_id: video_one.id},
            {video_id: video_two.id},
          ],
        },
      }
    }

    it "should show the static videos" do
      video_ids = data_mapping.videos.map(&:id)
      expect(video_ids).to include(video_one.id)
      expect(video_ids).to include(video_two.id)
    end

    it "should have the proper title and display_type" do
      expect(data_mapping.display_type).to eq("grid")
      expect(data_mapping.title).to eq(title)
    end
  end

  describe "for dynamic curations" do
    let(:title) { "my dynamic curation" }
    let(:data) {
      {
        type: "dynamic_curation",
        fields: {
          title: title,
          max_size: 1,
          type: "most_recent",
          display_type: "strip",
        },
      }
    }

    it "should only show the most recent video" do
      expect(data_mapping.limit).to eq(1)
      expect(data_mapping.videos.size).to eq(1)
      expect(data_mapping.videos.first.id).to eq(video_two.id)
    end

    it "should have the proper title and display_type" do
      expect(data_mapping.display_type).to eq("strip")
      expect(data_mapping.title).to eq(title)
    end
  end
end
