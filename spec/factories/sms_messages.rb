# frozen_string_literal: true

FactoryBot.define do
  factory :sms_message do
    text { "MyText" }
    from { "MyString" }
    to { "" }
    price_in_cents { "" }
    service { "SMS.io" }
    status { "MyString" }
  end
end
