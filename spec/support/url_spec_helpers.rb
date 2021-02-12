# frozen_string_literal: true

module UrlSpecHelpers
  def path_for_video(video, options={})
    channel_video_path(video.channel, video, options)
  end

  def request_json_header
    {
      ACCEPT: "application/json",
    }
  end

  def send_json_header
    {
      CONTENT_TYPE: "application/json",
    }
  end
end
