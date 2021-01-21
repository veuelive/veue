# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Follows", type: :request do
  let(:channel) { create(:channel) }
  let(:follower) { create(:user) }

  def follow_path_for_test
    channel_follow_path(channel)
  end

  describe "an anonymous user" do
    it "should halt authentication for create request" do
      post follow_path_for_test
      expect(response).to have_http_status(401)
    end

    it "should hault authentication for destroy request" do
      delete follow_path_for_test
      expect(response).to have_http_status(401)
    end

    it "should render streamer profile template" do
      get follow_path_for_test
      expect(response).to render_template(partial: "_streamer_profile")
    end
  end

  describe "user is logged in" do
    before do
      login_as follower
    end

    it "should create a follower for video streamer" do
      post follow_path_for_test
      expect(channel.followers.size).to eq(1)
    end

    it "should soft remove follower for video streamer" do
      post follow_path_for_test
      delete follow_path_for_test
      expect(channel.followers.size).to eq(0)
      expect(Follow.count).to eq(1)
      expect(Follow.first.unfollowed_at).to_not be_nil

      # and then we can resubscribe
      post follow_path_for_test
      expect(channel.reload.followers.size).to eq(1)
      expect(Follow.count).to eq(2)
    end

    it "should send consent message to follower on first follow of any streamer" do
      post follow_path_for_test

      # follower sms_status will be changed to :instructions_sent
      follower.reload
      expect(follower.instructions_sent?).to eq(true)

      perform_enqueued_jobs do
        SendConsentTextJob.perform_now(follower, channel)
        # SmsMessage will be sent with instructions to follower
        expect(SmsMessage.find_by(to: follower.phone_number)).to be_present
      end

      # Sms for consent will be sent only once
      expect {
        post channel_follow_path(create(:channel))
      }.to_not have_enqueued_job(SendConsentTextJob)
    end
  end
end
