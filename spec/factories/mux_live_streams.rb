FactoryBot.define do
  factory :mux_live_stream do
    mux_id { Faker::Alphanumeric.unique.alphanumeric(number: 46) }
    playback_id { Faker::Alphanumeric.unique.alphanumeric(number: 46) }
    stream_key { Faker::Alphanumeric.alphanumeric(number: 20) }
    user { association :user }
    mux_status { "idle" }

    # This is the ID that's in the webhooks text fixtures
    factory :stream_for_webhooks do
    end
  end
end
