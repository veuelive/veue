# frozen_string_literal: true

require "rails_helper"

describe "Videos" do
  before :example do
    @public_videos = create_list(:video, 5, {state: :finished})
    @video = @public_videos.first

    @protected_videos = create_list(:protected_video, 3)
    @private_videos = create_list(:private_video, 3)
    @private_video = @private_videos.first
    @protected_video = @protected_videos.first

    @pending_video = create(:video, {state: :pending})
    @live_video = create(:video, {state: :live})
  end

  describe "index" do
    before(:each) do
      get videos_path
    end

    it "render links to only the public videos" do
      expect(response.body).to include(video_path(@video))
      expect(response.body).to include(video_path(@live_video))
      expect(response).to have_http_status(:ok)
    end

    it "should not show videos in non-visible states" do
      expect(response.body).to_not include(video_path(@pending_video))
    end

    it "should not render with links to the protected videos" do
      expect(response.body).to_not include(video_path(@protected_video))
    end

    it "should not render with links to the private videos" do
      expect(response.body).to_not include(video_path(@private_video))
    end
  end

  describe "show by id" do
    describe "for a public viewer" do
      before(:each) do
        @viewer = create(:viewer)
        login_as @viewer
      end
      describe "for anyone" do
        it "should render the public video by id " do
          get video_path(@video)
          expect(response).to have_http_status(:ok)
          expect(@video.reload.video_views.size).to eq(1)
        end
      end

      describe "for someone who has the full id of the video" do
        it "should render the protected video by id for anyone" do
          get video_path(@protected_video)
          expect(response).to have_http_status(:ok)
          expect(@protected_video.reload.video_views.size).to eq(1)
        end

        it "should NOT allow me to see someone else's private video" do
          get video_path(@private_video)
          expect(response).to have_http_status(:not_found)
          expect(@private_video.reload.video_views.size).to eq(0)
        end
      end
    end

    describe "for the owner of the video" do
      before(:each) do
        @streamer = @private_video.user
        login_as @streamer
      end

      it "should allow me to see my own private video" do
        get video_path(@private_video)
        expect(response).to have_http_status(:ok)
        expect(@private_video.reload.video_views.size).to eq(1)
      end
    end
  end
end
