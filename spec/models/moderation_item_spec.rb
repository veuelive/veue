require 'rails_helper'

RSpec.describe ModerationItem do
  describe "API Disabled" do
    before :each do
      PerspectiveApi.enabled = false
    end

    it "should not call the perspective api when not enabled" do
      moderation_item = build(:moderation_item)
      moderation_item.fetch_scores!
      expect(moderation_item.summary_score).to eq(-1)
      expect(moderation_item.scores).to eq({})
    end
  end

  describe "API Enabled" do
    it "should return the mocked passing value" do
      item = build(:moderation_item)
      item.fetch_scores!
      expect(item.summary_score).to eq(0.1982)
      expect(item).to be_approved
    end

    it "should error on the error key" do
      PerspectiveApi.key = "ERROR"
      item = build(:moderation_item)
      item.fetch_scores!
      expect(item.summary_score).to eq(-1)
      expect(item).to be_approved
    end

    it "should fail on the failure!" do
      PerspectiveApi.key = "FAIL"
      item = build(:moderation_item)
      item.fetch_scores!
      expect(item.summary_score).to be > 0.5
      expect(item).to be_rejected
    end
  end
end
