# frozen_string_literal: true

class VideoDecorator < Draper::Decorator
  delegate_all
  decorates_association :channel

  def thumbnail_url
    "https://image.mux.com/#{object.mux_playback_id}/thumbnail.png"
  end

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

  def start_time_in_words(suffix="ago")
    started_at =
      if started_at_ms
        Time.zone.at(started_at_ms / 1000)
      else
        created_at
      end

    time = helpers.time_ago_in_words(started_at)

    # If its 'yesterday' we dont need to add the suffix
    return time if time == I18n.t("datetime.distance_in_words.x_days.one")

    "#{time} #{suffix}"
  end

  private

  def scheduled_today
    h.haml_concat(h.t("scheduling.scheduled_today"))
    h.haml_tag("local-time", minute: "numeric", hour: "numeric", datetime: scheduled_at.iso8601)
  end

  def scheduled_in_one_hour
    h.haml_concat(h.t("scheduling.very_soon"))
    h.haml_tag("relative-time", datetime: scheduled_at.iso8601)
  end

  def scheduled_this_week
    h.haml_tag("local-time", minute: "numeric", hour: "numeric", weekday: "long", datetime: scheduled_at.iso8601)
  end

  def future_schedule
    h.haml_tag(
      "local-time",
      month: "short",
      weekday: "short",
      minute: "numeric",
      hour: "numeric",
      datetime: scheduled_at.iso8601,
    )
  end
end
