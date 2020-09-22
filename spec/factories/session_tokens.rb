# frozen_string_literal: true

FactoryBot.define do
  factory :session_token do

    factory :login_attempt do
      phone_number { PhoneTestHelpers.generate_valid }
    end

    factory :active_login do
      state { :active }
    end
  end
end
