# frozen_string_literal: true

FactoryBot.define do
  factory :follow do
    unfollowed_at { nil }
  end
end
