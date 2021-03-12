# frozen_string_literal: true

require "./spec/support/phone_test_helpers"

FactoryBot.define do
  factory :user do
    display_name { Faker::Name.name[0..15].strip }
    phone_number { PhoneTestHelpers.generate_valid }

    trait :with_avatar do
      after :create do |user|
        file =  Rack::Test::UploadedFile.new('spec/factories/test.png', 'image/png')
        user.profile_image.attach(file)
      end
    end

    factory :streamer do
      after(:create, &:setup_as_streamer!)
    end

    factory :user_with_profile do
      about_me { Faker::Lorem.sentence(word_count: 10) }
      profile_image { Rack::Test::UploadedFile.new("spec/fixtures/profile.jpg", "image/jpg") }
    end
  end
end
