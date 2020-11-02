# frozen_string_literal: true

require './spec/support/phone_test_helpers'

FactoryBot.define do
  factory :user do
    display_name { Faker::Name.name }
    phone_number { PhoneTestHelpers.generate_valid }

    factory :streamer do
      mux_stream_key { Faker::Alphanumeric.alphanumeric }
      mux_live_stream_id { Faker::Alphanumeric.alphanumeric }
    end
  end
end
