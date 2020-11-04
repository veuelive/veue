# frozen_string_literal: true

FactoryBot.define do
  factory :video do
    user factory: :streamer
    state { :pending }
    title { Faker::Company.bs }
    visibility { 'public' }
    mux_asset_id { Faker::Alphanumeric.alphanumeric }
    mux_playback_id { Faker::Alphanumeric.alphanumeric }

    factory :vod_video do
      state { :finished }
      hls_url { "/__test/vod/playback.m3u8" }
    end

    factory :live_video do
      state { :live }
      hls_url { "/__test/live/playback.m3u8" }
      started_at_ms { Time.now.utc.to_ms }
      factory :live_protected_video do
        visibility {'protected'}
      end

      factory :live_private_video do
        visibility {'private'}
      end
    end
  end
end
