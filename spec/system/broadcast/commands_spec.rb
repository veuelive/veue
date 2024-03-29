# frozen_string_literal: true

require "system_helper"

describe "Broadcast Commands" do
  include BroadcastSystemHelpers

  let(:channel) { create(:channel) }

  before :example do
    resize_window_desktop
  end

  before :each do
    login_as(channel.user)
    visit broadcast_path(channel.active_video!)
  end

  describe "share features" do
    it "can copy the stream URL to the clipboard while streaming" do
      grant_clipboard_permissions
      find(".btn#share-btn").hover
      expect(page).to have_content("Share")
      find(".btn#share-btn").click
      expect(find(".select-menu--content")).to have_content("Copy")
      find(".select-menu--content__body__item.copy").click

      accept_alert

      expect_analytics_event("Broadcast", "Click Share", "Copy Share Link")

      clip_text = read_clipboard_text
      expect(clip_text).to eq(channel_share_link(channel))
      expect(clip_text).to include(channel.slug)
    end

    it "can open a new link" do
      find(".btn#share-btn").click
      expect(find(".select-menu")).to have_content("Copy")
      audience_window =
        window_opened_by do
          find(".select-menu--content__body__item.open").click
        end
      expect_analytics_event("Broadcast", "Click Share", "Open Share Link")
      switch_to_window audience_window
      expect(current_url).to eq(channel_share_link(channel))
    end

    describe "Change urls when private or protected" do
      %w[private protected].each do |visibility|
        it "should copy the private / protected link" do
          update_video_visibility(visibility)

          grant_clipboard_permissions
          find(".btn#share-btn").hover
          expect(page).to have_content("Share")
          find(".btn#share-btn").click
          expect(find(".select-menu--content")).to have_content("Copy")
          find(".select-menu--content__body__item.copy").click
          accept_alert
          clip_text = read_clipboard_text

          expect(clip_text).to eq(private_channel_share_link(channel))
          expect(clip_text).to include(channel.slug)
          expect(clip_text).to include(channel.active_video.id)
        end

        it "should open the private / protected link" do
          update_video_visibility(visibility)

          expect(page).to have_css("[data-video-visibility='#{visibility}']")

          find(".btn#share-btn").click
          expect(find(".select-menu--content")).to have_content("Copy")
          audience_window =
            window_opened_by do
              find(".select-menu--content__body__item.open").click
            end
          switch_to_window audience_window
          expect(current_url).to eq(private_channel_share_link(channel))
        end
      end
    end
  end
end
