# frozen_string_literal: true

require "rails_helper"

RSpec.describe DiscoverCuration::Component, type: :component do
  let!(:video) { create(:vod_video) }
  let(:videos) { [video.decorate] }
  let(:title) { "never before seen vod videos" }

  it "should render a curation component as a grid" do
    render_inline(described_class.new(title: title, videos: videos))

    expect(rendered_component).to have_content(title)
    expect(rendered_component).to have_css(".broadcasts")
  end

  it "should render a curation component as a strip" do
    render_inline(described_class.new(title: title, videos: videos, display_type: "strip"))

    expect(rendered_component).to have_content(title)
    expect(rendered_component).to have_css(".discover__strip")
    expect(rendered_component).to have_css(".discover__strip__items")
  end

  it "should not render if there are no videos" do
    videos = []
    render_inline(described_class.new(title: title, videos: videos))

    # Did not render
    expect(page).to have_no_selector("body")
  end
end
