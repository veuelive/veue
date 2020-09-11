# frozen_string_literal: true

require "rails_helper"

describe VideosController do
  render_views

  before :example do
    @videos = create_list(:video, 5, {state: :finished})
    @video = @videos.first
    @pending_video = create(:video, {state: :pending})
    @live_video = create(:video, {state: :live})
  end

  describe "index" do
    it "render links to the videos" do
      get :index
      expect(response.body).to include(video_path(@video))
      expect(response.body).to include(video_path(@live_video))

      # Don't show videos in non-visible states
      expect(response.body).to_not include(video_path(@pending_video))

      expect(response).to have_http_status(:ok)
    end
  end

  describe "show by id" do
    it "should render the video by id" do
      get :show, params: {id: @video}

      expect(response).to have_http_status(:ok)
    end
  end

  describe "show by slug" do
    let(:video_obj) { create(:video) }

    it "should render the video by slug" do
      get :show, params: {id: @video}

      expect(response).to have_http_status(:ok)
    end

    it "should render video even if slug not present" do
      video_obj.update!(slug: "")
      get :show, params: {id: video_obj}

      expect(response).to have_http_status(:ok)
    end
  end
end
