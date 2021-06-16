# frozen_string_literal: true

class CmsHeroMapper < CmsDataMapper
  def view_component
    ResponsiveHero::Component.new(image: image, link: link) do |component|
      component.responsive_images(responsive_images)
    end
  end

  def image
    @image ||= fields[:image]
  end

  def responsive_images
    @responsive_images ||= fields[:responsive_images]
  end

  def link
    @link ||= fields[:link]
  end
end
