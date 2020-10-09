# frozen_string_literal: true

class ChatMessage < VideoEvent
  def input_to_payload
    {
      name: user.display_name,
      message: input["message"],
      userId: user.to_param,
    }
  end

  def input_schema
    {
      properties: {
        message: String,
      },
      required: ["message"],
    }
  end

  # Immediately deliver via channel
  def channel_timecode_ms
    0
  end
end
