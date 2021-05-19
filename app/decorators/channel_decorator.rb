# frozen_string_literal: true

class ChannelDecorator < ApplicationDecorator
  delegate_all
  decorates_association :video

  def profile_image_circle(size=64)
    profile_image = users.first.profile_image
    if profile_image.attached?
      h.circle_image_tag(profile_image, size, class: "profile-image")
    else
      h.svg_tag("logo-circular", width: size.to_s, height: size.to_s, class: "profile-image")
    end
  end

  def channel_icon_circle(size=64)
    if channel_icon.attached?
      h.circle_image_tag(channel_icon, size)
    else
      h.svg_tag("logo-circular", width: size.to_s, height: size.to_s)
    end
  end

  def social_image(width, height)
    return unless profile_image.attached?

    h.url_for(profile_image.variant(resize_and_pad: [width, height]))
  end

  def follower_count
    helpers.number_to_social(object.followers.size)
  end

  def next_show_at_in_words
    if next_show_at < 1.hour.from_now
      scheduled_in_one_hour
    elsif next_show_at < 16.hours.from_now
      scheduled_today
    elsif next_show_at.to_date < 7.days.from_now
      scheduled_this_week
    else
      future_schedule
    end
  end

  private

  def scheduled_today
    h.haml_concat(h.t("scheduling.scheduled_today"))
    h.haml_tag("local-time", minute: "numeric", hour: "numeric", datetime: next_show_at.iso8601)
  end

  def scheduled_in_one_hour
    h.haml_concat(h.t("scheduling.very_soon"))
    h.haml_tag("relative-time", datetime: next_show_at.iso8601)
  end

  def scheduled_this_week
    h.haml_tag("local-time", minute: "numeric", hour: "numeric", weekday: "long", datetime: next_show_at.iso8601)
  end

  def future_schedule
    h.haml_tag(
      "local-time",
      month: "short",
      weekday: "short",
      day: "numeric",
      minute: "numeric",
      hour: "numeric",
      datetime: next_show_at.iso8601,
    )
  end
end
