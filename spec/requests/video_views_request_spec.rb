# frozen_string_literal: true

require "rails_helper"

describe "VideoViews", type: :request do
  let(:video) { create(:video) }

  it "should add a video_view object against video" do
    post video_video_views_path(video)

    video.reload
    expect(video.video_views.size).to eq(1)
  end
end
