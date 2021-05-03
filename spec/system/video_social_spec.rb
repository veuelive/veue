# frozen_string_literal: true

require "system_helper"

describe "Video social tags" do
  let(:video) { create(:video) }

  before(:each) do
    resize_window_desktop
  end

  describe "with a primary shot" do
    before(:each) do
      video.primary_shot.attach(fixture_file_upload("spec/factories/test.png", "image/png"))
      visit path_for_video(video)
    end

    it "should set the 'twitter:card' to 'summary_large_image'" do
      expect(page).to have_css("meta[content='summary_large_image'][name='twitter:card']", visible: false)
      expect(page).to have_css(
        "meta[content='#{video.decorate.social_image_hash[:big_image]}'][name='twitter:image']",
        visible: false,
      )
      expect(page).to have_css(
        "meta[content='#{video.decorate.social_image_hash[:thumbnail]}'][name='og:image']",
        visible: false,
      )
    end
  end

  describe "without a primary shot" do
    # if theres a primary shot, purge it!
    before(:each) { video.primary_shot.purge }

    it "should always have these tags" do
      visit path_for_video(video)

      expect(page).to have_css(
        "meta[content='Watch #{video.channel.name} on Veue!'][name='twitter:description']",
        visible: false,
      )
      expect(page).to have_css(
        "meta[content='Watch #{video.channel.name} on Veue!'][name='og:description']",
        visible: false,
      )
      expect(page).to have_css("meta[content='#{video.title}'][name='twitter:title']", visible: false)
      expect(page).to have_css("meta[content='#{video.title}'][name='og:title']", visible: false)
    end

    describe "and with a profile image" do
      before(:each) do
        video.channel.profile_image.attach(fixture_file_upload("spec/factories/test.png", "image/png"))
        visit path_for_video(video)
      end

      it "should use the profile image and make a small twitter card" do
        expect(page).to have_css("meta[content='summary'][name='twitter:card']", visible: false)
        expect(page).to have_css(
          "meta[content='#{video.decorate.social_image_hash[:thumbnail]}'][name='twitter:image']",
          visible: false,
        )
        expect(page).to have_css(
          "meta[content='#{video.decorate.social_image_hash[:thumbnail]}'][name='og:image']",
          visible: false,
        )
      end
    end

    describe "and without a profile image" do
      before(:each) do
        video.channel.profile_image.purge
        visit path_for_video(video)
      end

      it "should use the veue logo with a big summary card" do
        expect(page).to have_css("meta[content='summary_large_image'][name='twitter:card']", visible: false)
        expect(page).to have_css(
          "meta[content='#{video.decorate.social_image_hash[:big_image]}'][name='twitter:image']",
          visible: false,
        )
        expect(page).to have_css(
          "meta[content='#{video.decorate.social_image_hash[:thumbnail]}'][name='og:image']",
          visible: false,
        )
      end
    end
  end
end
