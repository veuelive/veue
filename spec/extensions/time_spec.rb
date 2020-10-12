# frozen_string_literal: true

require "rails_helper"

describe Time do
  it "supports #to_ms" do
    time = Time.zone.at(1_602_258_273.354636)
    expect(time.to_ms).to eq(1_602_258_273_355)
  end
end
