# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    display_name { Faker::Name.name }
    phone_number { PhoneTestHelpers.generate_valid }

    factory :streamer do
      mux_live_stream
    end
  end
end
