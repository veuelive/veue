# frozen_string_literal: true

require "system_helper"

# NOTE: These tests are trying to test a sequence that doesn't NORMALLY happen just
# within the rails app. This has to be combined with the real Electron App to get full / perfect results.
RSpec.describe "channel behaviour" do
  let(:channel) { create(:channel) }

  describe "channel with all the info" do
    it "should set custom info for the channel if its there" do
      do_not_translate

      visit(channel.slug)

      # The title is the one that we compose... like "Hampton's Chat"
      expect_meta_tag("twitter:title", "channels.twitter.title")
      expect_meta_tag("og:title", "channels.og.title")
      assert_title "channels.seo.title"

      # The descriptions should their about
      expect_meta_tag("twitter:description", channel.about)
      expect_meta_tag("og:description", channel.about)
    end

    it "should load channel show with uppercase slug too" do
      do_not_translate
      visit(channel.slug.upcase)

      expect_meta_tag("twitter:title", "channels.twitter.title")
      expect_meta_tag("og:title", "channels.og.title")
      assert_title "channels.seo.title"

      # The descriptions should their about
      expect_meta_tag("twitter:description", channel.about)
      expect_meta_tag("og:description", channel.about)
    end

    pending "test images in meta tag"
  end

  describe "channel with no special info" do
    before :each do
      channel.user.profile_image.detach
      channel.user.update!(about_me: nil)
    end

    it "should have default SEO information" do
      do_not_translate

      visit(channel.slug)

      # The title is the one that we compose... like "Hampton's Chat"
      expect_meta_tag("twitter:title", "channels.twitter.title")
      expect_meta_tag("og:title", "channels.og.title")
      assert_title "channels.seo.title"

      # The descriptions should be totally standard
      expect_meta_tag("twitter:description", "header.twitter.default_description")
      expect_meta_tag("og:description", "header.og.default_description")

      # Also default images
      expect_meta_tag("twitter:image", "header.twitter.default_image")
      expect_meta_tag("og:image", "header.og.default_image")
    end
  end

  def expect_meta_tag(named, content)
    expect(page).to have_selector("meta[name='#{named}'][content='#{content}']", visible: false)
  end
end
