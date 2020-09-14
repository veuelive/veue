# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    display_name { Faker::Name.name }
    phone_number { "+1904384" + SecureRandom.rand(1000...9999).to_s }

    factory :streamer do
      mux_live_stream
    end
  end
end
