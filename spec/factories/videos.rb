# frozen_string_literal: true

FactoryBot.define do
  factory :video do
    user factory: :streamer
    title { Faker::Company.bs }
    mux_asset_id { Faker::Alphanumeric.alphanumeric }
    mux_playback_id { Faker::Alphanumeric.alphanumeric }

    factory :live_video do
      state { :live }
    end
  end
end
