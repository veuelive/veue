# frozen_string_literal: true

require "rails_helper"

describe "WcsClient", type: :unit do
  SOME_RTMP_URL = "rtmp://rtmp.test"
  SOME_STREAM_KEY = "abcdefhijklmnop"

  before do
    stub_const "WCS_URL", "https://wcs.test"
    stub_const "RTMP_URL", SOME_RTMP_URL
  end

  it "should form mixer uris correctly" do
    expect(WcsClient.mixer_uri("key")).to eq("mixer://key")
  end

  it "should republish" do
    WcsClient.conn = double("conn")

    expect(WcsClient.conn).to receive(:post).with(
      "https://wcs.test/rest-api/push/startup",
      {
        streamName: SOME_STREAM_KEY,
        rtmpUrl: SOME_RTMP_URL,
      }.to_json,
      {"Content-Type": "application/json"},
    )
    WcsClient.republish!(SOME_STREAM_KEY)
  end
end
