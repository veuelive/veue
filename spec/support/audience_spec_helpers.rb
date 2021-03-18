# frozen_string_literal: true

module AudienceSpecHelpers
  def audience_view_controller
    "div[data-controller~='audience-view']"
  end

  def audience_view_state_css(state, equality_operator="=")
    "#{audience_view_controller}[data-audience-view-state#{equality_operator}'#{state}']"
  end

  def audience_audio_state_css(state, equality_operator="=")
    "#{audience_view_controller}[data-audience-view-audio-state#{equality_operator}'#{state}']"
  end

  def is_video_playing?
    page.has_css?(audience_view_state_css("playing"))
  end

  def is_video_paused?
    page.has_css?(audience_view_state_css("paused"))
  end

  def is_video_muted?
    page.has_css?(audience_audio_state_css("muted"))
  end

  def is_video_unmuted?
    page.has_css?(audience_audio_state_css("unmuted"))
  end

  def assert_video_is_playing
    find("*[data-audience-view-state='playing']")
    page.assert_no_selector("*[data-audience-view-timecode='-1']")
    page.assert_no_selector("*[data-audience-view-timecode='0']")
  end

  def current_timecode
    Integer(find("*[data-audience-view-timecode]")["data-audience-view-timecode"], 10)
  end

  def someone_chatted(message=Faker::Quote.most_interesting_man_in_the_world.first(182), timecode_ms=0)
    video.chat_messages.create!(
      user: create(:user),
      input: {message: message},
      timecode_ms: timecode_ms,
    )
  end

  def streamer_visited(url, timecode_ms)
    video.browser_navigations.create!(
      {
        user: video.user,
        input: {
          url: url,
          canGoBack: false,
          isLoading: false,
          canGoForward: false,
        },
        timecode_ms: timecode_ms,
      },
    )
  end

  def write_chat_message(text)
    find(".write-area").base.send_keys(text, :enter)
  end

  def type_message(text)
    find(".write-area").base.send_keys(text)
  end
end
