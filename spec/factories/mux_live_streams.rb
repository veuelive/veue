# frozen_string_literal: true

FactoryBot.define do
  factory :mux_live_stream do
    mux_id { Faker::Alphanumeric.unique.alphanumeric(number: 46) }
    mux_playback_id { Faker::Alphanumeric.unique.alphanumeric(number: 46) }
    stream_key { Faker::Alphanumeric.alphanumeric(number: 20) }
    user { association :user }
    mux_status { "idle" }
  end
end
