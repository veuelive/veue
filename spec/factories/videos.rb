# frozen_string_literal: true

FactoryBot.define do
  factory :video do
    channel factory: :channel
    user { channel.user }
    state { :pending }
    title { Faker::Company.bs }
    visibility { "public" }
    mux_asset_id { Faker::Alphanumeric.alphanumeric }
    mux_playback_id { Faker::Alphanumeric.alphanumeric }

    factory :vod_video do
      state { :finished }
      hls_url { "/__test/vod/playback.m3u8" }
      after(:create) do |video|
        # It's important for some tests that we create the chat messages BEFORE we go live
        # as we need to make sure the video layout event fires
        create_list(:chat_message, 10, user: create(:user), video: video, timecode_ms: 0)
        create(:video_layout_event, video: video, user: video.user)
      end
    end

    factory :protected_video do
      visibility { "protected" }
    end

    factory :private_video do
      visibility { "private" }
    end

    factory :upcoming_video do
      state { :pending }
    end

    factory :live_video do
      state { :live }
      hls_url { "/__test/live/playback.m3u8" }
      started_at_ms { Time.now.utc.to_ms }
    end
  end
end
