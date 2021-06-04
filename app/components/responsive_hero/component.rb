# frozen_string_literal: true

module ResponsiveHero
  class Component < ViewComponent::Base
    renders_many :responsive_images, ::ResponsiveImage::Component

    def initialize(image:, link:)
      super

      raise(ArgumentError.new("Image cannot be nil")) if image.nil?
      raise(ArgumentError.new("Link cannot be nil")) if link.nil?

      @image = image
      @link = link
    end
  end
end
