# frozen_string_literal: true

require "rails_helper"

describe "Videos" do
  before :example do
    @public_videos = create_list(:video, 5, {state: :finished})
    @video = @public_videos.first

    @protected_videos = create_list(:live_protected_video, 3)
    @private_videos = create_list(:live_private_video, 3)
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
    describe "for a random person" do
      before(:each) do
        # TODO: sign in as someone who does not own the video
      end

      it "should render the video by id for anyone of it is public" do
        get video_path(@video)

        @video.reload
        expect(response).to have_http_status(:ok)
        expect(@video.video_views.size).to eq(1)
      end

      it "should NOT allow me to see someone else's private video" do

      end
    end

    describe "for someone who has the URL" do

    end

    describe "for the owner of the video" do
      it "should allow me to see my own private video" do

      end
    end
  end
end
