# frozen_string_literal: true

module AudienceSpecHelpers
  def is_video_playing?
    find("div[data-controller='audience-view']")["data-audience-view-state"] == "playing"
  end

  def assert_video_is_playing
    find("*[data-audience-view-state='playing']")
    page.assert_no_selector("*[data-audience-view-timecode='-1']")
    page.assert_no_selector("*[data-audience-view-timecode='0']")
  end

  def current_timecode
    Integer(find("*[data-audience-view-timecode]")["data-audience-view-timecode"], 10)
  end

  def someone_chatted(message=Faker::Quote.most_interesting_man_in_the_world, timecode_ms=0)
    video.chat_messages.create!(user: create(:user), input: {message: message}, timecode_ms: timecode_ms)
  end

  def streamer_visited(url, timecode_ms)
    video.browser_navigations.create!({
                                        user: video.user,
                                        input: {
                                          url: url,
                                          canGoBack: false,
                                          isLoading: false,
                                          canGoForward: false,
                                        },
                                        timecode_ms: timecode_ms,
                                      })
  end
end
