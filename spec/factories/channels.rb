# frozen_string_literal: true

FactoryBot.define do
  factory :channel do
    user { create(:streamer) }
    name { user.display_name }
  end
end
