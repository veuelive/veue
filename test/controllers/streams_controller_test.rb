require "test_helper"

class StreamsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @stream = streams(:one)
  end

  test "should get index" do
    get streams_url
    assert_response :success
  end

  test "should get new" do
    get new_stream_url
    assert_response :success
  end

  test "should create stream" do
    assert_difference("Stream.count") do
      post streams_url, params: {stream: {name: @stream.name, slug: @stream.slug, state: @stream.state, stream_key: @stream.stream_key}}
    end

    assert_redirected_to stream_url(Stream.last)
  end

  test "should show stream" do
    get stream_url(@stream)
    assert_response :success
  end

  test "should get edit" do
    get edit_stream_url(@stream)
    assert_response :success
  end

  test "should update stream" do
    patch stream_url(@stream), params: {stream: {name: @stream.name, slug: @stream.slug, state: @stream.state, stream_key: @stream.stream_key}}
    assert_redirected_to stream_url(@stream)
  end

  test "should destroy stream" do
    assert_difference("Stream.count", -1) do
      delete stream_url(@stream)
    end

    assert_redirected_to streams_url
  end
end
