# frozen_string_literal: true

require "rails_helper"

RSpec.describe DiscoverContent::Component, type: :component do
  let(:body_text) { "Hi there friends! How are you?!" }
  let(:body) { "<p class='friends'>#{body_text}</p>" }

  it "should render with content as HTML" do
    render_inline(described_class.new(body: body))

    expect(rendered_component).to have_css(".friends")
    expect(rendered_component).to have_content(body_text)
  end

  it "should not render with no content" do
    body = nil
    render_inline(described_class.new(body: body))
    expect(page).to have_no_selector("body")
  end
end
