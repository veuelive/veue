# frozen_string_literal: true

FactoryBot.define do
  factory :moderation_item do
    text { Faker::Lorem.paragraph }
    video { create(:video) }
    user { create(:user) }
    video_event { create(:chat_message, video: video, user: user) }
  end
end
