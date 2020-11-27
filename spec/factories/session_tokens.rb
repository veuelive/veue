# frozen_string_literal: true

FactoryBot.define do
  factory :session_token do
    phone_number { PhoneTestHelpers.generate_valid }

    factory :active_login do
      state { :active }
    end
  end
end
