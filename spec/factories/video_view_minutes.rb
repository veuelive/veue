# frozen_string_literal: true

FactoryBot.define do
  factory :video_view_minute do
    video_view { create(:video_view) }
  end
end
