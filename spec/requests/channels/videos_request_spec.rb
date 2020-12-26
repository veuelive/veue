# frozen_string_literal: true

require "rails_helper"

describe Channels::VideosController do
  describe "show by id" do
    describe "for a public viewer" do
      before(:each) do
        @viewer = create(:viewer)
        login_as @viewer
      end

      describe "for anyone" do
        it "should render the public video by id " do
          video = create(:video)
          get path_for_video(video)
          expect(response).to have_http_status(:ok)
          expect(video.reload.video_views.size).to eq(1)
        end
      end

      describe "for someone who has the full id of the video" do
        it "should render the protected video by id for anyone" do
          protected_video = create(:protected_video)
          get path_for_video(protected_video)
          expect(response).to have_http_status(:ok)
          expect(protected_video.reload.video_views.size).to eq(1)
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
      before(:each) do
        @private_video = create(:private_video)
        @streamer = @private_video.channel.user
        login_as @streamer
      end

      it "should allow me to see my own private video" do
        get path_for_video(@private_video)
        expect(response).to have_http_status(:ok)
        expect(@private_video.reload.video_views.size).to eq(1)
      end
    end
  end
end
