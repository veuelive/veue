# frozen_string_literal: true

class UserJoinedEvent < VideoEvent
  has_one :video_view, dependent: :nullify

  def input_to_payload
    {
      name: video_view.user.display_name,
    }
  end

  # Immediately deliver via channel
  def channel_timecode_ms
    0
  end
end
