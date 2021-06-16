# frozen_string_literal: true

require "rails_helper"

RSpec.describe DiscoverUpcoming::Component, type: :component do
  let(:title) { "my super awesome amazing channels" }
  let(:channel) { create(:channel, next_show_at: 1.day.from_now) }
  let(:shows) { [channel.decorate] }

  it "should render upcoming shows as a strip" do
    render_inline(described_class.new(title: title, shows: shows))

    expect(rendered_component).to have_css(".discover__strip")
    expect(rendered_component).to have_css(".discover__strip__items")
    expect(rendered_component).to have_content(title)
    expect(rendered_component).to have_css(".upcoming-card")
  end

  it "should not render with no shows" do
    shows = []
    render_inline(described_class.new(title: title, shows: shows))

    expect(page).to have_no_selector("body")
  end
end
