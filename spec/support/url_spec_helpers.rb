# frozen_string_literal: true

module UrlSpecHelpers
  def path_for_video(video, options={})
    channel_video_path(video.channel, video, options)
  end
end
