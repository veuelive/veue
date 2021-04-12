# frozen_string_literal: true

require "rails_helper"

RSpec.describe VideoView, type: :model do
  let(:video) { create(:live_video) }
  let(:first_user) { create(:user) }
  let(:second_user) { create(:user) }
  let(:fingerprint) { SecureRandom.uuid }

  describe "live video" do
    it "should create a video_view for a new user" do
      video_view = VideoView.process_view!(video, first_user, 1, fingerprint, true)
      expect(video_view.user).to eq(first_user)
      expect(video_view.fingerprint).to eq(fingerprint)
      expect(video_view.video_view_minutes_count).to eq(1)

      expect(video.user_joined_events.published.last.user).to eq(first_user)

      # When we are the same user, we won't create a new view
      same_video_view = VideoView.process_view!(video, first_user, 1, fingerprint, true)
      expect(same_video_view.id).to eq(video_view.id)
      # No more minutes, because it's the same minute
      expect(video_view.video_view_minutes_count).to eq(1)

      # If we have the same fingerprint, we won't count as a new view
      same_video_view = VideoView.process_view!(video, nil, 2, fingerprint, true)
      expect(same_video_view.id).to eq(video_view.id)
      # No more minutes, because it's the same minute
      expect(same_video_view.video_view_minutes_count).to eq(2)

      # Different fingerprint and user
      duplicate_video_view = VideoView.process_view!(video, nil, 2, SecureRandom.uuid, true)
      # This is a new video view, so it's count is only one minute
      expect(duplicate_video_view.video_view_minutes_count).to eq(1)
      expect(duplicate_video_view.id).to_not eq(video_view.id)

      expect(video.user_joined_events.published.count).to eq(1)

      # If the same fingerprinted user logs in with a new user, it doesn't count! Sorry, yo!
      same_video_view = VideoView.process_view!(video, second_user, 3, fingerprint, true)
      # Can't get a new view
      expect(same_video_view.id).to eq(video_view.id)
      # But we still keep the original user, cuz they are doing something fishy.
      expect(same_video_view.user).to eq(first_user)

      # This fishy person does NOT get a new user joined event
      expect(video.user_joined_events.published.count).to eq(1)
      # If you are actually looking like a new person...

      VideoView.process_view!(video, second_user, 4, "NEW FINGERPRINT", true)
      # And you even get announced!
      expect(video.user_joined_events.published.count).to eq(2)
    end

    it "should upgrade old views to new ones" do
      VideoView.process_view!(video, nil, 1, fingerprint, false)
      VideoView.process_view!(video, first_user, 2, fingerprint, false)
      expect(video.video_views.count).to eq(1)
      expect(video.video_views.first.user).to eq(first_user)
      expect(video.video_views.first.video_view_minutes_count).to eq(2)

      # and we can upgrade a view *again* later
      VideoView.process_view!(video, nil, 1, "NEW FINGERPRINT SAME USER", false)
      VideoView.process_view!(video, first_user, 2, "NEW FINGERPRINT SAME USER", false)

      # The user is on a different device, so we count this as a unique view
      expect(video.video_views.count).to eq(2)
    end

    it "should ignore the video creator" do
      video_view = VideoView.process_view!(video, video.user, 1, fingerprint, true)
      expect(video_view).to eq(nil)
    end
  end

  describe "minute counting" do
    def view_at(minute)
      VideoView.process_view!(video, first_user, minute, fingerprint, true)
    end

    it "should increment in a forward progression" do
      expect(view_at(2).video_view_minutes_count).to eq(1)
      expect(view_at(2).video_view_minutes_count).to eq(1)
      expect(view_at(3).video_view_minutes_count).to eq(2)
      expect(view_at(4).video_view_minutes_count).to eq(3)
      expect(view_at(10).video_view_minutes_count).to eq(4)
      expect(view_at(10).video_view_minutes_count).to eq(4)
    end

    it "should allow us to go backwards and count re-watches the next day" do
      expect(view_at(12).video_view_minutes_count).to eq(1)
      expect(view_at(9).video_view_minutes_count).to eq(2)
      Timecop.travel(1.day.from_now)
      expect(view_at(12).video_view_minutes_count).to eq(3)
    end
  end

  describe "updated_at of video" do
    let(:video) { create(:vod_video) }

    it "Should update the video updated_at time on video view" do
      last_updated_at = video.updated_at
      VideoView.process_view!(video, first_user, 1, fingerprint, true)
      expect(video.reload.updated_at).not_to eq(last_updated_at)
    end
  end
end
