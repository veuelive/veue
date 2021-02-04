# frozen_string_literal: true

require "./spec/support/phone_test_helpers"

FactoryBot.define do
  factory :user do
    display_name { Faker::Name.name[0..15].strip }
    phone_number { PhoneTestHelpers.generate_valid }

    factory :streamer do
      after(:create, &:setup_as_streamer!)
    end

    factory :no_name_user do
      display_name { "hi" }
    end
  end
end
