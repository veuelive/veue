# frozen_string_literal: true

require "system_helper"

describe "Streamer scheduling" do
  include AuthenticationTestHelpers::SystemTestHelpers
  include BroadcastSystemHelpers

  let(:channel) { create(:channel) }
  let(:streamer) { channel.user }
  let(:video) { channel.videos.active.last }

  before :each do
    visit("/")
    login_as(streamer)
  end

  describe "initial state" do
    it "Should have scheduling selects disabled for a pending (non-scheduled) video" do
      visit("/broadcasts")
      find("body").click
      find("#settings-btn").click
      expect(find("#broadcast-settings__form")).to have_field("video_scheduled_checkbox", checked: false)
      expect(find("#broadcast-settings__form")).to have_field("video_scheduled_day", disabled: true)
      expect(find("#broadcast-settings__form")).to have_field("video_scheduled_time", disabled: true)
    end

    it "Should have checkbox checked and selects enabled and prefilled for scheduled videos" do
      # Theres no videos currently, so we have to create it here.
      video = create(:upcoming_video, channel: channel)

      two_days_from_now = 2.days.from_now.change(min: 15).utc

      video.update!(scheduled_at: two_days_from_now)
      # Video gets scheduled first and THEN visit /broadcasts to check for a bug with replacing the video

      visit("/broadcasts")
      find("body").click

      find("#settings-btn").click

      # Expect all selects to be prefilled with appropriate values, not disabled, and the video_scheduled_box
      # should be checked.
      expect(find("#broadcast-settings__form")).to have_field("video_scheduled_checkbox", checked: true)
      expect(find("#broadcast-settings__form")).to have_field("video_scheduled_day", disabled: false)
      expect(find("#broadcast-settings__form")).to have_field("video_scheduled_time", disabled: false)

      local_time = two_days_from_now.localtime

      expect(find_day_option(local_time).selected?).to be(true)
      expect(find_time_option(local_time.hour, local_time.min).selected?).to be(true)
    end
  end

  describe "scheduling videos" do
    before(:each) do
      visit "/broadcasts"
      find("body").click
    end

    describe "videos not currently scheduled" do
      before(:each) do
        find("#settings-btn").click
      end

      it "Should schedule a non-scheduled video 2 weeks in the future at 11:45pm" do
        scheduled_time = 13.days.from_now.change(min: 30)
        local_time = scheduled_time.localtime

        within("#broadcast-settings__form") do
          check("video_scheduled_checkbox")
          find_day_option(local_time).click
          find_time_option(local_time.hour, local_time.min).click
          click_button("Update")
        end

        expect(page).to have_css(".flash-success")
        expect(video.reload.scheduled_at).to eq(scheduled_time)
        expect(video).to be_scheduled
      end

      it "Should leave update disabled if only the day option is selected" do
        local_time = 5.days.from_now.change(min: 0).localtime

        within("#broadcast-settings__form") do
          check("video_scheduled_checkbox")
          expect(find_button("Update", disabled: true)).to be_disabled
          find_day_option(local_time).click
          expect(find_button("Update", disabled: true)).to be_disabled
        end
      end

      it "should not allow you to choose a time option until day is selected" do
        within("#broadcast-settings__form") do
          check("video_scheduled_checkbox")
          expect(find("#video_scheduled_time")).to be_disabled
        end
      end

      it "When you change to a blank date, time options should be disabled" do
        local_time = 3.days.from_now.change(min: 45).localtime

        within("#broadcast-settings__form") do
          check("video_scheduled_checkbox")
          find_day_option(local_time).click
          find("#video_scheduled_day option[value='']").click
          expect(find("#video_scheduled_time")).to be_disabled
          expect(find_button("Update", disabled: true)).to be_disabled
        end
      end
    end

    describe "already scheduled videos" do
      it "Should move a scheduled video to pending and scheduled_at to nil" do
        video.update!(scheduled_at: 1.week.from_now.change(min: 0))

        find("#settings-btn").click

        within("#broadcast-settings__form") do
          uncheck("video_scheduled_checkbox")
          click_button("Update")
        end

        expect(page).to have_css(".flash-success")
        expect(video.reload.scheduled_at).to be_nil
        expect(video).to_not be_scheduled
      end
    end
  end
end
