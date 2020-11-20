# frozen_string_literal: true

require "rails_helper"

RSpec.describe VideoView, type: :model do
  let(:first_user) { create(:user) }
  let(:second_user) { create(:user) }

  SOME_REQUEST = OpenStruct.new({
                                  remote_ip: Faker::Internet.ip_v4_address,
                                  user_agent: "MY ROBOTO MACHINE",
                                })

  describe "live video" do
    let(:video) { create(:live_video) }

    it "should create a video_view for a new user" do
      video_view = VideoView.process_view!(video, first_user, SOME_REQUEST)
      expect(video_view.user).to eq(first_user)
      expect(video_view.details).to eq({
                                         ip_address: SOME_REQUEST.remote_ip,
                                         browser: SOME_REQUEST.user_agent,
                                       })

      expect(video.user_joined_events.last.user).to eq(first_user)

      same_video_view = VideoView.process_view!(video, first_user, SOME_REQUEST)
      expect(same_video_view.id).to eq(video_view.id)

      duplicate_video_view = VideoView.process_view!(video, nil, SOME_REQUEST)
      expect(duplicate_video_view.id).to_not eq(video_view.id)

      expect(video.user_joined_events.count).to eq(1)

      new_video_view = VideoView.process_view!(video, second_user, SOME_REQUEST)
      expect(new_video_view.id).to_not eq(video_view.id)
      expect(new_video_view.user).to eq(second_user)

      expect(video.user_joined_events.last.user).to eq(second_user)
    end

    it "should upgrade old views to new ones" do
      VideoView.process_view!(video, nil, SOME_REQUEST)
      VideoView.process_view!(video, first_user, SOME_REQUEST)
      expect(video.video_views.count).to eq(1)
      expect(video.video_views.first.user).to eq(first_user)
    end
  end
end
