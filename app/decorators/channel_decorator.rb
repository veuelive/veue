# frozen_string_literal: true

class ChannelDecorator < ApplicationDecorator
  delegate_all
  decorates_association :video

  def profile_image_circle(size=64)
    if profile_image.attached?
      h.circle_image_tag(profile_image, size)
    else
      h.svg_tag("logo-circular", width: size.to_s, height: size.to_s)
    end
  end

  def follower_count
    helpers.number_to_social(object.followers.size)
  end
end
