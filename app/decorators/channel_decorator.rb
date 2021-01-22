# frozen_string_literal: true

class ChannelDecorator < ApplicationDecorator
  delegate_all

  def profile_image_circle(size=64)
    if profile_image.attached?
      h.circle_image_tag(profile_image, size)
    else
      h.svg_tag("logo-circular", style: "width: #{size}; height: #{size}")
    end
  end

  def follower_count
    helpers.number_to_social(object.followers.count)
  end
end
