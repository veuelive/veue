# frozen_string_literal: true

module AudienceSpecHelpers
  def is_video_playing?
    find("div[data-controller='audience-view']", visible: false)["data-audience-view-state"] == "playing"
  end

  def ensure_video_starts_playing
    loop do
      break if is_video_playing?

      play = find("a[title='Toggle Play']")
      play.click
    end
  end
end
