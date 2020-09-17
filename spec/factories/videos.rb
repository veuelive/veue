# frozen_string_literal: true

FactoryBot.define do
  factory :video do
    user factory: :streamer
    mux_live_stream { user.mux_live_stream }
    title { Faker::Company.bs }
    mux_playback_id { mux_live_stream.mux_playback_id }

    factory :live_video do
      state { :live }
    end
  end
end
