# frozen_string_literal: true

require "system_helper"

describe "Link sharing" do
  let(:video) { create(:live_video) }
  let(:user) { create(:user) }

  describe "With clipboard permissions" do
    before(:each) do
      grant_clipboard_permissions
    end

    it "should copy a link to the clipboard and not prompt a login" do
      visit path_for_video(video)
      find(".link-share__image").click
      expect(page).to have_no_css(".modal-content")
      expect(page).to have_content(I18n.t("link_copy.success"))
      clip_text = read_clipboard_text
      expect(clip_text).to eq(channel_share_link(video.channel))
    end

    it "should copy a link to the clipboard when logged in" do
      login_as(user)
      visit path_for_video(video)
      find(".link-share__image").click
      expect(page).to have_content(I18n.t("link_copy.success"))
      clip_text = read_clipboard_text
      expect(clip_text).to eq(channel_share_link(video.channel))
    end
  end

  describe "Without clipboard permissions" do
    before(:each) do
      revoke_clipboard_permissions
    end

    it "should fail to copy a link to the clipboard and not prompt a login" do
      visit path_for_video(video)
      find(".link-share__image").click
      expect(page).to have_no_css(".modal-content")
      expect(page).to have_content(I18n.t("link_copy.failure"))
    end

    it "should fail to copy a link to the clipboard when logged in" do
      login_as(user)
      visit path_for_video(video)
      find(".link-share__image").click
      expect(page).to have_content(I18n.t("link_copy.failure"))
    end
  end
end
