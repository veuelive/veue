require "system_helper"

describe "adding snapshots to videos" do
  let(:video) { create(:vod_video) }
  let!(:snapshot_one) { create(:video_snapshot, priority: 1, video: video) }
  let!(:snapshot_two) { create(:video_snapshot, priority: 2, video: video) }
  let(:snapshot_one_query) { "##{dom_id(snapshot_one)}" }
  let(:snapshot_two_query) { "##{dom_id(snapshot_two)}" }

  before(:each) do
    resize_window_desktop
    login_as(video.user)
    visit(channel_video_video_snapshots_path(video.channel, video))
  end

  it "should allow you to set a priority 2 shot as priority 1 and vice versa" do
    within(snapshot_one_query) do
      click_button("Set Secondary")
      expect(page).to have_button("Set Secondary", disabled: true)
      expect(video.secondary_shot.blob).to eq(snapshot_one.image.blob)
    end

    within(snapshot_two_query) do
      click_button("Set Primary")
      expect(page).to have_button("Set Primary", disabled: true)
      expect(video.primary_shot.blob).to eq(snapshot_two.image.blob)
    end
  end
end
