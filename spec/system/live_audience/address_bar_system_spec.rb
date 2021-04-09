# frozen_string_literal: true

require "system_helper"
require_relative("../../support/audience_spec_helpers")

describe "Live Audience View - URL Bar" do
  include AudienceSpecHelpers
  let(:video) { create(:live_video) }

  before :each do
    @random_message = someone_chatted
    someone_chatted
    streamer_visited("http://hamptoncatlin.com", 0)
    streamer_visited("http://ninjaturtlesrock.com", 504)
    streamer_visited("http://timeslam.com", 5000)

    visit(path_for_video(video))
  end
end
