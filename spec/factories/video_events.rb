# frozen_string_literal: true

def random_boolean
  [true, false].sample
end

FactoryBot.define do
  factory :video_layout_event do
    # This is the layout of the video in public/__test/vod
    input {
      {
        width: 1920,
        height: 1080,
        sections: [
          {x: 0, y: 10, type: "camera", width: 1728, height: 972, priority: 2},
        ],
      }
    }
  end

  factory :chat_message do
    video { create(:video) }
    user { create(:user) }
    input { {message: Faker::Alphanumeric.unique.alpha(number: 20)} }
  end
end
