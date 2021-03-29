# frozen_string_literal: true

require "rails_helper"

RSpec.describe Pin, type: :model do
  let(:video) { build_stubbed(:live_video) }
  it "should be created from a URL and a name" do
    pin = Pin.process_create(
      video,
      1_000,
      "https://hamptoncatlin.com/sushipants",
      "Sushi Pants",
      some_thumbnail_upload,
    )
    expect(pin).to be_valid
  end
end
