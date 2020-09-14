# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    display_name { Faker::Name.name }
    phone_number { "+1904384" + SecureRandom.rand(1000...9999).to_s }
    user_login_attempts { [association(:active_login)] }

    factory :streamer do
      mux_live_stream
      username { Faker::Internet.unique.username }
    end
  end
end
