# frozen_string_literal: true

FactoryBot.define do
  factory :channel do
    name { Faker::Name.name[0..15].strip }
    after(:create) do |channel|
      channel.users << create(:user_with_profile)
    end
  end
end
