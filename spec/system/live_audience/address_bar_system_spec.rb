# frozen_string_literal: true

require "system_helper"
require_relative("../../support/audience_spec_helpers")

describe "Live Audience View - URL Bar" do
  include AudienceSpecHelpers
  let(:video) { create(:live_video) }

  before do
    @random_message = someone_chatted
    someone_chatted
    streamer_visited("http://hamptoncatlin.com", 0)
    streamer_visited("http://ninjaturtlesrock.com", 204)
    streamer_visited("http://timeslam.com", 5000)
  end

  before :each do
    visit(video_path(video))
  end

  it "should show the urls in sequence" do
    expect(page).to have_content(video.browser_navigations.first.payload["url"])
    expect(page).to have_content(video.browser_navigations.second.payload["url"])
  end
end
