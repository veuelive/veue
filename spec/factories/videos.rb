# frozen_string_literal: true

FactoryBot.define do
  factory :video do
    user factory: :streamer
    title { Faker::Company.bs }
    mux_asset_id { Faker::Alphanumeric.alphanumeric }
    mux_playback_id { Faker::Alphanumeric.alphanumeric }

    factory :live_video do
      state { :live }
      started_at_ms { Time.now.utc.to_ms }
    end
  end
end
