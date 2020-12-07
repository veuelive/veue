# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Follows", type: :request do
  let(:streamer) { create(:streamer) }
  let(:follower) { create(:user) }
  let(:video) { create(:video, user: streamer) }

  describe "an anonymous user" do
    it "should hault authentication for create request" do
      post video_follow_path(video_id: video.to_param)
      expect(response).to have_http_status(401)
    end

    it "should hault authentication for destroy request" do
      delete video_follow_path(video_id: video.to_param)
      expect(response).to have_http_status(401)
    end

    it "should render streamer profile template" do
      get video_follow_path(video_id: video.to_param)
      expect(response).to render_template(partial: "_streamer_profile")
    end
  end

  describe "user is logged in" do
    before do
      login_as follower
    end

    it "should create a follower for video streamer" do
      post video_follow_path(video_id: video.to_param)
      expect(streamer.streamer_follows.count).to eq(1)
    end

    it "should soft remove follwer for video streamer" do
      Follow.create!(streamer_follow: streamer, user_follow: follower)
      delete video_follow_path(video_id: video.to_param)
      expect(streamer.streamer_follows.count).to eq(0)
    end

    it "should send consent message to follwer on first follow of any streamer" do
      post video_follow_path(video_id: video.to_param)

      # follower sms_status will be changed to :instructions_sent
      follower.reload
      expect(follower.sms_status).to eq("instructions_sent")

      perform_enqueued_jobs do
        SendConsentTextJob.perform_now(follower, streamer)
        # SmsMessage will be sent with instructions to follower
        expect(SmsMessage.find_by(to: follower.phone_number)).to be_present
      end

      # Sms for consent will be sent only once
      another_streamer = create(:streamer)
      another_video = create(:video, user: another_streamer)

      expect {
        post video_follow_path(video_id: another_video.to_param)
      }.to_not have_enqueued_job(SendConsentTextJob)
    end
  end
end
