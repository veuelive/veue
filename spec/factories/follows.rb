FactoryBot.define do
  factory :follow do
    follower_user_id { "MyString" }
    streamer_user_id { "MyString" }
    unfollowed_at { "2020-09-30 16:15:38" }
  end
end
