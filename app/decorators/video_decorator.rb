# frozen_string_literal: true

class VideoDecorator < Draper::Decorator
  delegate_all
  decorates_association :channel

  def stream_type
    case state
    when "live"
      "live"
    when "pending", "starting"
      "upcoming"
    else
      "vod"
    end
  end

  def active_viewers_count
    helpers.number_to_social(video.video_views.connected.count)
  end

  def display_state
    case state
    when "live"
      "LIVE"
    when "finished"
      "REPLAY"
    else
      "UPCOMING"
    end
  end

  def broadcast_type
    browser_broadcast ? "browser" : "app"
  end

  def scheduled_at_in_words
    if scheduled_at < 1.hour.from_now
      scheduled_in_one_hour
    elsif scheduled_at < 16.hours.from_now
      scheduled_today
    elsif scheduled_at < 6.days.from_now
      scheduled_this_week
    else
      future_schedule
    end
  end

  def start_time_in_words(_suffix="ago")
    started_at =
      if started_at_ms
        Time.at(started_at_ms / 1000).utc
      else
        created_at
      end

    h.haml_tag("time-ago", datetime: started_at.iso8601)
  end

  # @return {Hash{:thumbnail => String}, {:big_image => String, nil}}
  def social_image_hash
    return primary_social_image_hash if primary_shot.blob
    return secondary_social_image_hash if channel.profile_image.blob

    fallback_social_image_hash
  end

  # Uses the videos primary shot for both +:big_image+ and +:thumbnail+
  # @return {Hash{:thumbnail => String, :big_image => String}}
  def primary_social_image_hash
    thumbnail = primary_shot.variant(resize_and_pad: [500, 500, {background: "black"}]).processed
    big_image = primary_shot.variant(resize_to_limit: [500, 500]).processed

    {thumbnail: Router.url_for_variant(thumbnail), big_image: Router.url_for_variant(big_image)}
  end

  # Use a channels profile image as the +:thumbnail+, no +:big_image+ defined.
  # @return {Hash{:thumbnail => String, :big_image => nil}}
  def secondary_social_image_hash
    thumbnail = channel.profile_image.variant(resize_and_pad: [100, 100]).processed

    {thumbnail: Router.url_for_variant(thumbnail)}
  end

  # Uses the default social media logo for the +:big_image+ and +:thumbnail+.
  # @return {Hash{:thumbnail => String, :big_image => String}}
  def fallback_social_image_hash
    # removes trailing slash
    url = Router.root_url.slice(0...-1)
    thumbnail = url + helpers.asset_pack_path("media/images/small-social-logo.png")
    big_image = url + helpers.asset_pack_path("media/images/large-social-logo.png")
    {thumbnail: thumbnail, big_image: big_image}
  end
end
