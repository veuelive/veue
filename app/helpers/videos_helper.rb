# frozen_string_literal: true

module VideosHelper
  def current_video_id
    return current_video.id if controller_name == "videos" && action_name == "show" && current_video.present?

    nil
  end

  def video_card_image_url(video)
    video.primary_shot.attached? ? video.primary_shot.variant(resize_to_limit: [500, 500]) : video.thumbnail_url
  end

  def videos_controller?
    controller_name == "videos"
  end

  def play_button(mobile: false)
    classes = "active-icon toggle-play"

    if (mobile == true)
      classes += " mobile"
    end

    content_tag(:a, class: classes, title: "Toggle Play", data: {
      action: "click->audience-view#togglePlay",
      target: "audience-view.togglePlay"
    }) do
      svg_tag "play"
    end
  end

  def audio_button(mobile: false)
    classes = "icon toggle-audio"

    if mobile == true
      classes += " mobile"
    end

    content_tag(:a, class: classes, title: "Toggle Audio", data: {
      action: "click->audience-view#toggleAudio",
      target: "audience-view.toggleAudio"
    }) do
      svg_tag "speaker"
    end
  end
end
