# frozen_string_literal: true

require "rails_helper"

class VideoEventSample < VideoEvent
  def input_schema
    {
      properties: {
        foo: String,
        isLivingLegend: :boolean,
        count: Integer,
        flags: [:boolean],
        list: [
          {
            name: String,
            height: Integer,
          },
        ],
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

  # As a test, only publish if they are a living legend
  def set_published_state
    self.published = payload["isLivingLegend"]
  end
end

RSpec.describe VideoEvent, type: :model do
  let(:user) { create(:user) }
  let(:video) { create(:video) }

  def event_with_input(input)
    VideoEventSample.new(video: video, user: user, input: input)
  end

  def expect_valid_input(input)
    event = event_with_input(input)
    raise(event.errors.inspect) unless event.valid?

    expect(event).to be_valid
    event
  end

  def expect_invalid_input(input, error_contains:)
    event = event_with_input(input)
    expect(event).to_not be_valid
    expect(event.errors[:input][0]).to include(error_contains)
  end

  it "should transform the input into a payload" do
    ves = event_with_input({foo: "bar", isLivingLegend: true})
    expect(ves).to be_valid
    expect(ves.save).to eq(true)
    expect(ves.payload).to eq({foo: "Bar", year: 1982, isLivingLegend: true}.stringify_keys)
  end

  describe "JSON input validation" do
    it "should validate the input for key existence" do
      ves = event_with_input({bar: 123, isLivingLegend: true})
      expect(ves).to_not be_valid
      expect(ves.errors[:input]).to_not be_empty
      expect(ves.errors[:input]).to eq(["Missing property foo", "Unknown property bar"])
    end

    it "should validate key type" do
      ves = event_with_input({foo: 123, isLivingLegend: true})
      expect(ves).to_not be_valid
      input_error = ves.errors[:input].first
      expect(input_error).to match("String")
      expect(input_error).to match("foo")
    end

    it "should catch non-boolean values" do
      ves = event_with_input({foo: "hi", isLivingLegend: 3})
      expect(ves).to_not be_valid
      input_error = ves.errors[:input].first
      expect(input_error).to match("boolean")
      expect(input_error).to match("isLivingLegend")
    end

    it "should consider nil a bad type" do
      expect_invalid_input({foo: nil}, error_contains: "foo")
    end

    describe "integer properties" do
      it "should allow integers" do
        expect_valid_input({foo: "hi", count: 1})
      end

      it "should block non-integers" do
        expect_invalid_input({foo: "hi", count: false}, error_contains: "Integer")
      end

      it "should coerce strings into integers" do
        event = expect_valid_input({foo: "hi", count: "1"})
        expect(event.input["count"]).to eq(1)
      end
    end

    describe "arrays of simple objects" do
      it "should allow for empty arrays" do
        expect_valid_input({foo: "hi", flags: []})
      end

      describe "boolean arrays" do
        it "should allow all booleans in an array key" do
          expect_valid_input({foo: "hi", flags: [true, false, true]})
        end

        it "should catch bad types" do
          expect_invalid_input({foo: "hi", flags: [true, false, 1]}, error_contains: "flags")
        end
      end
    end

    describe "object arrays" do
      it "should allow empty arrays" do
        expect_valid_input({foo: "bar", list: []})
      end

      it "should allow empty hashes (nothing required)" do
        expect_valid_input({foo: "bar", list: [{}]})
      end

      it "should break on unknown properties" do
        expect_invalid_input(
          {foo: "bar", list: [{length: 12}]},
          error_contains: "list[0].length",
        )
      end

      it "should allow properly formatted types" do
        expect_valid_input(
          {
            foo: "bar",
            list: [
              {
                name: "Hampton",
                height: 6,
              },
              {name: "Cindy", height: 5},
            ],
          },
        )
      end

      it "should detect the wrong type inside of a nested array" do
        expect_invalid_input(
          {
            foo: "bar",
            list: [
              {
                name: "Hampton",
                height: 6,
              },
              {name: "Cindy", height: false},
            ],
          },
          error_contains: "list[1].height",
        )
      end
    end
  end

  describe "Publishing and Broadcasting rules" do
    it "shouldn't publish non-living legends" do
      event = expect_valid_input({foo: "hi", isLivingLegend: false})
      event.save!
      expect(event).to_not be_published
      expect_to_sse_broadcast(0)
    end

    it "should publish living legends" do
      event = expect_valid_input({foo: "hi", isLivingLegend: true})
      event.save!
      expect(event).to be_published
      expect_to_sse_broadcast
    end
  end
end
