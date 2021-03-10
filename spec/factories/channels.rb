# frozen_string_literal: true

FactoryBot.define do
  factory :channel do
    user { create(:user_with_profile) }
    name { user.display_name }
  end
end
