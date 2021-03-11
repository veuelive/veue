# frozen_string_literal: true

require "rails_helper"

RSpec.describe "VideoSnapshots", type: :request do
  let(:user) { create(:streamer) }
  let(:video) { create(:live_video, channel: user.channels.first) }
  let(:random_user) { create(:user) }
  let(:admin) { create(:admin) }

  describe "POST /snapshots" do
    it "Should create a new video snapshot for the owner of a video" do
      login_as user

      expect(video.video_snapshots.count).to be(0)

      image = fixture_file_upload("spec/factories/test.png", "image/png")

      post channel_video_video_snapshots_path(video.channel, video),
           params: {
             image: image,
             timecode: 0,
             device_id: SecureRandom.uuid,
             device_type: "screen",
           }

      expect(response).to have_http_status(:success)
      expect(video.video_snapshots.count).to eq(1)
    end

    it "Should not create a new video snapshot for non-owners of a video" do
      [nil, random_user].each do |not_owner|
        login_as not_owner
        expect(video.video_snapshots.count).to be(0)

        image = fixture_file_upload("spec/factories/test.png", "image/png")

        post channel_video_video_snapshots_path(video.channel, video),
             params: {
               image: image,
               timecode: 0,
               device_id: SecureRandom.uuid,
               device_type: "screen",
             }

        expect(response).to have_http_status(:not_found)
        expect(video.video_snapshots.count).to eq(0)
      end
    end
  end

  describe "GET /snapshots" do
    it "returns http not found for an anonymous user" do
      get channel_video_video_snapshots_path(video.channel, video)
      expect(response).to have_http_status(:not_found)
    end

    it "returns http not found for a logged in user who doesnt own the video" do
      login_as random_user
      get channel_video_video_snapshots_path(video.channel, video)
      expect(response).to have_http_status(:not_found)
    end

    it "returns http success for a logged in user and owner of the video" do
      login_as video.user
      get channel_video_video_snapshots_path(video.channel, video)
      expect(response).to have_http_status(:success)
    end
  end
end
