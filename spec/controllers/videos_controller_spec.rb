# frozen_string_literal: true

require "rails_helper"

describe VideosController do
  render_views

  before :example do
    @videos = create_list(:video, 5)
    @video = @videos.first
  end

  describe "index" do
    it "render links to the videos" do
      get :index
      expect(assigns(:videos)).to include(@video)

      expect(response.body).to include(video_path(@video))

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

  describe "streamer view" do
    before :each do
      @streamer = create(:streamer)
      sign_in @streamer
    end

    it "should include the stream key!" do
      get :broadcast

      expect(@streamer.stream_key).to have_attributes(size: (be > 2))
      expect(response.body).to include(@streamer.stream_key)
    end
  end
end
