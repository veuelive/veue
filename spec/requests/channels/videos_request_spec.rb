# frozen_string_literal: true

require "rails_helper"

describe Channels::VideosController do
  describe "show by id" do
    describe "for a public viewer" do
      let(:user) { create(:user) }

      before(:each) do
        login_as user
      end

      describe "for anyone" do
        it "should render the public video by id " do
          video = create(:video)
          get path_for_video(video)
          expect(response).to have_http_status(:ok)
          expect(video.reload.video_views.size).to eq(0)
        end
      end

      describe "for someone who has the full id of the video" do
        it "should render the protected video by id for anyone" do
          protected_video = create(:protected_video)
          get path_for_video(protected_video)
          expect(response).to have_http_status(:ok)
          expect(protected_video.reload.video_views.size).to eq(0)
        end

        it "should NOT allow me to see someone else's private video" do
          private_video = create(:private_video)
          get path_for_video(private_video)
          expect(response).to have_http_status(:not_found)
          expect(private_video.reload.video_views.size).to eq(0)
        end
      end
    end

    describe "for the owner of the video" do
      let(:private_video) { create(:private_video) }

      before(:each) do
        login_as private_video.channel.user
      end

      it "should allow me to see my own private video" do
        get path_for_video(private_video)
        expect(response).to have_http_status(:ok)
        # but you don't count as a viewer
        expect(private_video.reload.video_views.size).to eq(0)
      end
    end

    describe "viewed requests" do
      let(:video) { create(:video) }

      it "should mark them as non-live views" do
        expect(VideoView.count).to eq(0)

        post viewed_channel_video_url(video.channel, video, minute: 1)

        expect(VideoView.count).to eq(1)

        post viewed_channel_video_url(video.channel, video, minute: 2)

        expect(VideoView.count).to eq(1)
        expect(VideoView.first.video_view_minutes_count).to eq(2)
        expect(VideoView.first.video_view_minutes.where(is_live: false).count).to eq(2)
      end
    end
  end
end
