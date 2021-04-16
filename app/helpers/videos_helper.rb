# frozen_string_literal: true

module VideosHelper
  def current_video_id
    return current_video.id if controller_name == "videos" && action_name == "show" && current_video.present?

    nil
  end

  def video_card_image_url(video)
    video.primary_shot.attached? ? video.primary_shot.variant(resize_to_fill: [350, 221]) : video.thumbnail_url
  end

  def video_link_path(video)
    if video.live?
      channel_path(video.channel)
    else
      channel_video_path(video.channel, video)
    end
  end

  def upcoming_stream?
    current_video&.stream_type == "upcoming"
  end

  def play_button(mobile: false)
    classes = "active-icon toggle-play"

    classes +=
      if mobile == true
        " mobile"
      else
        " desktop"
      end

    tag.a(
      class: classes,
      title: "Toggle Play",
      data: {
        action: "click->audience--player-controls#togglePlay",
        target: "audience--player-controls.togglePlay",
      },
    ) do
      svg_tag("play")
    end
  end

  def audio_button(mobile: false)
    classes = "toggle-audio"

    classes +=
      if mobile == true
        " mobile"
      else
        " desktop"
      end

    tag.a(
      class: classes,
      title: "Toggle Audio",
      data: {
        action: "click->audience--player-controls#toggleAudio click->audience--player-controls#hideMuteBanner",
        target: "audience--player-controls.toggleAudio",
      },
    ) do
      svg_tag("volume-max")
    end
  end

  def seconds_to_time(seconds)
    return unless seconds

    [seconds / 3600, seconds / 60 % 60, seconds % 60].map { |t| t.to_s.rjust(2, "0") }.join(":")
  end

  def show_video_title?
    upcoming_stream? || current_video && !current_video.scheduled?
  end
end
