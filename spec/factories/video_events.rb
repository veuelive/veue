# frozen_string_literal: true

FactoryBot.define do
  factory :video_layout_event do
    # This is the layout of the video in public/__test/vod
    input {
      {
        width: 1280,
        height: 1080,
        sections: [
          {
            x: 0,
            y: 0,
            type: "screen",
            width: 1152,
            height: 742,
            priority: 1,
          },
          {
            x: 0,
            y: 742,
            type: "camera",
            width: 450,
            height: 338,
            priority: 2,
          },
        ],
        timecode: {x: 450, y: 742, width: 360, digits: 12, height: 10},
      }
    }
  end

  factory :chat_message do
    video { create(:video) }
    user { create(:user) }
    input { {message: Faker::Alphanumeric.unique.alpha(number: 20)} }
  end
end
