# frozen_string_literal: true

class VideoReactionEvent < VideoEvent
  def input_to_payload
    {
      name: user.display_name,
    }
  end

  # Immediately deliver via channel
  def instant_broadcast_processing?
    true
  end
end
