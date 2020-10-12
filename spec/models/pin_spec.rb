# frozen_string_literal: true

require "rails_helper"

RSpec.describe Pin, type: :model do
  let(:video) { create(:live_video) }
  it "should be created from a URL and a name" do
    Pin.process_create(
      video,
      1_000,
      "https://hamptoncatlin.com/sushipants",
      "Sushi Pants",
      "",
    )
  end
end
