# frozen_string_literal: true

FactoryBot.define do
  factory :channel do
    name { Faker::Name.name[0..15].strip }
    transient do
      next_show_at { nil }
    end

    after(:create) do |channel, evaluator|
      channel.users << create(:user_with_profile)
      channel.update_columns(next_show_at: evaluator.next_show_at) if evaluator.next_show_at
    end
  end
end
