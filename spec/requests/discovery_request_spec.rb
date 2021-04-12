# frozen_string_literal: true

require "rails_helper"

describe DiscoverController do
  before :example do
    @public_videos = create_list(:vod_video, 5, {state: :finished})
    @video = @public_videos.first

    @protected_videos = create_list(:protected_video, 3)
    @private_videos = create_list(:private_video, 3)
    @private_video = @private_videos.first
    @protected_video = @protected_videos.first

    @pending_video = create(:video, {state: :pending})
    @live_video = create(:live_video, {state: :live})
  end

  describe "index" do
    before(:each) do
      get root_path
    end

    it "render links to only the public videos" do
      expect(response.body).to include(path_for_video(@video))
      expect(response.body).to include(channel_path(@live_video.channel))
      expect(response.body).to_not include(path_for_video(@live_video))
      expect(response).to have_http_status(:ok)
    end

    it "should not show videos in non-visible states" do
      expect(response.body).to_not include(path_for_video(@pending_video))
    end

    it "should not render with links to the protected videos" do
      expect(response.body).to_not include(path_for_video(@protected_video))
    end

    it "should not render with links to the private videos" do
      expect(response.body).to_not include(path_for_video(@private_video))
    end
  end
end
