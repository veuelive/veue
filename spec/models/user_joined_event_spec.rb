# frozen_string_literal: true

require "rails_helper"

RSpec.describe UserJoinedEvent, type: :model do
  let(:video) { create(:live_video) }

  it "should rate limit" do
    Timecop.freeze

    max_per_minute = 2

    stub_const("USER_JOIN_RATE_LIMIT", max_per_minute)

    max_per_minute.times do
      create_new_video_view
    end

    # We did the max above, so we created all of them!
    expect(video.user_joined_events.count).to eq(max_per_minute)

    # This one won't get created because time is frozen, but we are at the max
    create_new_video_view
    # No more new ones!
    expect(video.user_joined_events.count).to eq(max_per_minute)

    # Move 30 seconds and we are still limited
    Timecop.travel(30.seconds.from_now)
    create_new_video_view
    expect(video.user_joined_events.count).to eq(max_per_minute)

    # Let's go far enough into the future
    Timecop.travel(1.minute.from_now)
    create_new_video_view
    expect(video.user_joined_events.count).to eq(max_per_minute + 1)

    # All done!
    Timecop.unfreeze
  end

  def create_new_video_view
    user = create(:user)
    VideoView.process_view!(video, user, 0, user.id, true)
  end
end
