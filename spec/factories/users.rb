# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    username { Faker::Internet.username }
    email { Faker::Internet.email(name: username) }
    confirmed_at { 5.days.ago }
    password { "mohawk" }
    password_confirmation { password }

    factory :streamer do
      mux_live_stream
    end
  end
end
