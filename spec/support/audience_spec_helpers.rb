# frozen_string_literal: true

module AudienceSpecHelpers
  def audience_view_controller
    "div[data-controller~='audience-view']"
  end

  def audience_view_state_css(state, equality_operator="=")
    "#{audience_view_controller}[data-audience--player-controls-state#{equality_operator}'#{state}']"
  end

  def audience_audio_state_css(state, equality_operator="=")
    "#{audience_view_controller}[data-audience--player-controls-audio-state#{equality_operator}'#{state}']"
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

  def assert_video_is_playing(seconds=1)
    expect(page).to have_css("*[data-audience--player-controls-state='playing']")
    expect(page).to have_content(:all, /00:00:\d[#{seconds}-9]+/, wait: 15)
  end

  def ensure_controls_visible
    find(".primary-canvas").hover
    expect(page).to have_css(".player-controls")
  end

  def current_timecode
    Integer(find("*[data-timecode]")["data-timecode"], 10)
  end

  def someone_chatted(message=Faker::Quote.unique.most_interesting_man_in_the_world, timecode_ms=0)
    video.chat_messages.create!(
      user: create(:user),
      input: {message: message[0..180]},
      timecode_ms: timecode_ms,
    )
  end

  def write_chat_message(text=Faker::Lorem.sentence)
    ensure_live_event_source
    find(".write-area").base.send_keys(text, :enter)
  end

  def type_message(text)
    find(".write-area").base.send_keys(text)
  end
end
