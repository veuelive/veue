# frozen_string_literal: true

require "rails_helper"

RSpec.describe VideoEvent, type: :model do
  let(:user) { create(:user) }
  let(:video) { create(:video) }

  class VideoEventSample < VideoEvent
    def input_schema
      {
        properties: {
          foo: String,
          isLivingLegend: :boolean,
        },
        required: ["foo"],
      }
    end

    def input_to_payload
      {
        foo: input["foo"].capitalize,
        year: 1982,
        isLivingLegend: input["isLivingLegend"],
      }
    end
  end

  it "should transform the input into a payload" do
    ves = VideoEventSample.create!(video: video, user: user, input: {foo: "bar", isLivingLegend: true})
    expect(ves).to be_valid
    expect(ves.payload).to eq({foo: "Bar", year: 1982, isLivingLegend: true}.stringify_keys)
  end

  describe "JSON input validation" do
    it "should validate the input for key existence" do
      ves = VideoEventSample.new(video: video, user: user, input: {bar: 123, isLivingLegend: true})
      expect(ves).to_not be_valid
      expect(ves.errors[:input]).to_not be_empty
      expect(ves.errors[:input]).to eq(["Missing property foo", "Unknown property bar"])
    end

    it "should validate key type" do
      ves = VideoEventSample.new(video: video, user: user, input: {foo: 123, isLivingLegend: true})
      expect(ves).to_not be_valid
      input_error = ves.errors[:input].first
      expect(input_error).to match("String")
      expect(input_error).to match("foo")
    end

    it "should catch non-boolean values" do
      ves = VideoEventSample.new(video: video, user: user, input: {foo: "hi", isLivingLegend: 3})
      expect(ves).to_not be_valid
      input_error = ves.errors[:input].first
      expect(input_error).to match("boolean")
      expect(input_error).to match("isLivingLegend")
    end
  end
end
