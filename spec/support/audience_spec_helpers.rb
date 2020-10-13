# frozen_string_literal: true

module AudienceSpecHelpers
  def is_video_playing?
    find("div[data-controller='audience-view']")["data-audience-view-state"] == "playing"
  end

  def assert_video_is_playing
    find("*[data-audience-view-state='playing']")
    page.assert_no_selector("*[data-audience-view-timecode='-1']")
    page.assert_no_selector("*[data-audience-view-timecode='0']")
    puts find("*[data-audience-view-timecode]")["data-audience-view-timecode"].inspect
  end

  def current_timecode
    Integer(find("*[data-audience-view-timecode]")["data-audience-view-timecode"], 10)
  end
end
