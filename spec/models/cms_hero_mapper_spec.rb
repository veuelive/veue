# frozen_string_literal: true

require "rails_helper"

RSpec.describe CmsHeroMapper do
  let(:data_mapper) { CmsHeroMapper.new(data) }
  let(:image) { "https://cdn.buttercms.com/7XWI7ZbTTk2a0ckohjdr" }

  describe "with no responsive images" do
    let(:data) {
      {
        type: "hero_image",
        fields: {
          image: image,
          link: "https://example.com",
        },
      }
    }

    it "responsive_images should be empty" do
      expect(data_mapper.responsive_images).to be_blank
    end
  end

  describe "with responsive images" do
    let(:max_width) { 500 }
    let(:data) {
      {
        type: "hero_image",
        fields: {
          image: image,
          link: "https://example.com",
          responsive_images: [
            {
              max_width: max_width,
              image: image,
            },
          ],
        },
      }
    }

    it "responsive_images should have a mapped hash" do
      responsive_image = data_mapper.responsive_images.first
      expect(responsive_image[:max_width]).to eq(max_width)
      expect(responsive_image[:image]).to eq(image)
    end
  end
end
