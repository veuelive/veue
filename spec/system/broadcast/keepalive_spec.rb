# frozen_string_literal: true

require "system_helper"

describe "Broadcaster" do
  describe "Keepalive Logic" do
    include BroadcastSystemHelpers
    include ActiveSupport::Testing::TimeHelpers

    let(:channel) { create(:channel) }
    let(:video) { channel.active_video! }

    before :example do
      resize_window_desktop
    end

    before :each do
      login_as(channel.user)
    end

    describe "pending videos" do
      it "should update time when you load the broadcaster" do
        expect(video.updated_at).to be > 1.minute.ago
        travel 10.minutes

        video.reload
        expect(video.updated_at).to be < 3.minutes.ago
        visit broadcast_path(video)
        wait_for_broadcast_state("ready")

        video.reload
        expect(video.updated_at).to be > 2.minutes.ago
      end

      it "should cancel after a while" do
        visit broadcast_path(video)
        expect(video).to be_pending

        visit cron_path

        video.reload
        expect(video).to be_pending

        travel 5.hours

        visit cron_path

        expect(page).to have_content("ok")

        video.reload
        expect(video).to be_cancelled

        expect(Video.count).to eq(1)

        visit broadcast_path(video)
        shift_to_broadcast_view

        # This will be the second video is ready
        wait_for_broadcast_state("ready")

        # See, we have two!
        expect(Video.count).to eq(2)
      end
    end
  end
end
