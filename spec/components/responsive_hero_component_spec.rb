# frozen_string_literal: true

require "rails_helper"

RSpec.describe ResponsiveHero::Component, type: :component do
  let(:fields) {
    {
      responsive_images: [
        {
          image: "https://via.placeholder.com/400x100",
          max_width: 400,
        },
      ],
      image: "https://via.placeholder.com/500x150",
      link: "/home",
    }
  }

  subject {
    render_inline(described_class.new(link: fields[:link], image: fields[:image])) do |c|
      c.responsive_images(fields[:responsive_images])
    end
  }

  it "renders with responsive images" do
    subject

    expect(rendered_component).to have_selector("picture")
    expect(rendered_component).to have_css(%(a[href='#{fields[:link]}']))
    expect(rendered_component).to have_css(%(img[src='#{fields[:image]}']))

    responsive_image = fields[:responsive_images].first
    expect(rendered_component).to have_css(%(source[srcset*='#{responsive_image[:image]}']))
    expect(rendered_component).to have_css(%(source[media*='#{responsive_image[:max_width]}px']))
  end

  it "will render without a responsive image" do
    responsive_image = fields[:responsive_images].first.dup

    fields.delete(:responsive_images)

    subject

    expect(rendered_component).to have_selector("picture")
    expect(rendered_component).to have_css(%(a[href='#{fields[:link]}']))
    expect(rendered_component).to have_css(%(img[src='#{fields[:image]}']))

    expect(rendered_component).to_not have_css(%(source[srcset*='#{responsive_image[:image]}']))
    expect(rendered_component).to_not have_css(%(source[media*='#{responsive_image[:max_width]}px']))
  end

  it "will raise an error if image is blank" do
    fields.delete(:image)

    expect {
      subject
    }.to raise_error(ArgumentError)
  end

  it "will raise an error if link is blank" do
    fields.delete(:link)

    expect {
      subject
    }.to raise_error(ArgumentError)
  end

  it "will raise an error if responsive images are not given an image" do
    fields[:responsive_images].first.delete(:image)

    expect {
      subject
    }.to raise_error(ArgumentError)
  end

  it "will raise an error if not given a max width" do
    fields[:responsive_images].first.delete(:max_width)

    expect {
      subject
    }.to raise_error(ArgumentError)
  end

  it "will raise an error if responsive images max width is not an integer" do
    fields[:responsive_images].first[:max_width] = "not an int :O"

    expect {
      subject
    }.to raise_error(ArgumentError)
  end
end
