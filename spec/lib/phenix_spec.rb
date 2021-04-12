# frozen_string_literal: true

require "rails_helper"

describe Phenix do
  let(:video) { create(:video) }
  let(:channel) { video.channel }

  describe Phenix::EdgeAuth do
    describe "publishing capabilities" do
      it "should have no spaces" do
        # No spaces!
        expect(Phenix::EdgeAuth.publishing_capabilities).to_not match(/\s/)
      end
    end

    it "should build publish token with no errors" do
      token = Phenix::EdgeAuth.publish_token(channel, video)
      expect(token).to start_with("DIGEST:")
    end
  end

  describe Phenix::Webhooks do
    it "should rebroadcast if no video found" do
      stub = stub_request(:post, "https://sushitown.ngrok.io/_/_/phenix")

      expect(Phenix::Webhooks.process({data: {tags: ["webhookHost:sushitown.ngrok.io"]}})).to_not be_nil
      expect(stub).to have_been_requested.once
    end

    it "should NOT rebroadcast if we have the video ID" do
      video = create(:live_video)

      expect(video).to be_live

      Phenix::Webhooks.process(
        {
          what: "ended",
          data: {
            tags: %W[webhookHost:sushitown.com videoId:#{video.id}],
            duration: 5000,
            uri: "vod.m3u8",
          },
        },
      )
      video.reload

      expect(video.duration).to eq(5)
      expect(video).to be_ended
    end

    it "Should ignore same hostname" do
      old_hostname = ENV["HOSTNAME"]
      ENV["HOSTNAME"] = "sushitown.ngrok.io"
      expect(Phenix.primary_hostname).to eq("sushitown.ngrok.io")
      expect(Phenix::Webhooks.process({data: {tags: ["webhookHost:ushitown.ngrok.io"]}})).to eq(false)
      ENV["HOSTNAME"] = old_hostname
    end

    it "Should ignore non-approved url origins" do
      old_hostname = ENV["HOSTNAME"]
      ENV["HOSTNAME"] = "hamptoncatlin.com"
      expect(Phenix.primary_hostname).to eq("hamptoncatlin.com")
      expect(Phenix::Webhooks.process({data: {tags: ["webhookHost:leggyeggy.com"]}})).to eq(false)
      ENV["HOSTNAME"] = old_hostname
    end

    it "should fetch tags" do
      def expect_tag_fetch(tags, tag_name, data)
        expect(
          Phenix::Webhooks.find_tag(
            {
              data: {
                tags: tags,
              },
            },
            tag_name,
          ),
        ).to eq(data)
      end

      expect_tag_fetch(["videoId:abcdef"], "videoId", "abcdef")
      expect_tag_fetch(%w[videoIdd:a videoId:b], "videoId", "b")
      expect_tag_fetch(%w[a:b], "videoId", nil)
    end
  end
end
