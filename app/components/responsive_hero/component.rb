# frozen_string_literal: true

module ResponsiveHero
  class Component < ::ViewComponent::Base
    renders_many :responsive_images, ::ResponsiveImage::Component

    attr_reader :image, :link

    def initialize(image:, link: nil)
      super
      @image = image
      @link = link
    end

    def render?
      @image.present?
    end
  end
end
