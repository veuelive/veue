# frozen_string_literal: true

FactoryBot.define do
  factory :follow do
    follower_user_id { user.to_param }
    streamer_user_id { user.to_param }
    unfollowed_at { nil }
  end
end
