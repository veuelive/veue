# frozen_string_literal: true

FactoryBot.define do
  factory :video_snapshot do
    video { create(:video) }
    # image { Rack::Test::UploadedFile.new("spec/factories/test.png", "image/png") }
    image { Rack::Test::UploadedFile.new("spec/fixtures/profile.jpg", "image/jpg") }
    timecode { Faker::Number.within(range: 1..100_000) }
    viewer_count { Faker::Number.within(range: 1..100_000) }
    device_id { SecureRandom.uuid }
    device_type { %w[screen camera].sample }
  end
end
