# frozen_string_literal: true

FactoryBot.define do
  factory :user_login_attempt do
    factory :active_login do
      state { :active }
    end
  end
end
