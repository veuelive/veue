# frozen_string_literal: true

module ResponsiveImage
  # Renders an image inside of a +<source srcset="" media="(max-width: #{max_width}px)>"+ tag.
  #   Should be used in conjunction with ResponsiveHero::Component
  class Component < ViewComponent::Base
    def initialize(max_width:, image:)
      super
      @max_width = Integer(max_width)
      @image = image
    end
  end
end
