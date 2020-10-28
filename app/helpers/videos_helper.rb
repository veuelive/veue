# frozen_string_literal: true

module VideosHelper
  def current_video_id
    return current_video.id if controller_name == "videos" && action_name == "show" && current_video.present?

    nil
  end

  def video_card_image_url(video)
    video.primary_shot.attached? ? video.primary_shot.variant(resize_to_limit: [500, 500]) : video.thumbnail_url
  end
end
