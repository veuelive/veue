# frozen_string_literal: true

require "rails_helper"

describe Phenix do
  let(:video) { create(:video) }
  let(:channel) { video.channel }

  describe Phenix::EdgeAuth do
    describe "publishing capabilities" do
      it "should have no spaces" do
        # No spaces!
        expect(Phenix::EdgeAuth.publishing_capabilities).to_not match(/ /)
      end
    end

    it "should build publish token with no errors" do
      token = Phenix::EdgeAuth.publish_token(channel, video)
      expect(token).to start_with("DIGEST:")
    end
  end
end
