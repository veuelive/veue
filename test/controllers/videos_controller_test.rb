require 'test_helper'

class VideosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @video = videos(:jorts)
  end

  test "should get index" do
    get videos_url
    assert_response :success
  end

  test "should show video" do
    get video_url(@video)
    assert_response :success
  end
end
