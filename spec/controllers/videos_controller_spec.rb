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

  describe "show" do
    it "should render the video" do
      get :show, params: {id: @video.id}

      expect(response).to have_http_status(:ok)
    end
  end

  describe "streamer view" do
    before :each do
      @streamer = create(:streamer)
      sign_in @streamer
    end

    it "should include the stream key!" do
      get :streamer

      expect(@streamer.stream_key).to have_attributes(size: (be > 2))
      expect(response.body).to include(@streamer.stream_key)
    end
  end
end
