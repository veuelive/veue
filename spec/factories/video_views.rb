FactoryBot.define do
  factory :video_view do
    video { create(:video) }
  end
end
