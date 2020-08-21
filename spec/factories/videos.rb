# frozen_string_literal: true

FactoryBot.define do
  factory :video do
    user factory: :streamer
    mux_live_stream { user.mux_live_stream }
    title { Faker::Company.bs }
    mux_playback_id { Faker::Alphanumeric.alphanumeric }
  end
end