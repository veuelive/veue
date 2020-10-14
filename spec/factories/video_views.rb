# frozen_string_literal: true

FactoryBot.define do
  factory :video_view do
    user { nil }
    video { nil }
    details { "" }
  end
end
