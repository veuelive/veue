# frozen_string_literal: true

class ChatMessage < VideoEvent
  validates :text, presence: true

  def input_to_payload
    {
      name: user.display_name,
      message: input["message"],
      userId: user.to_param,
      byStreamer: video.user_id == user.to_param,
    }
  end

  def input_schema
    {
      properties: {
        message: String,
      },
      required: %w[message],
    }
  end

  def text
    input["message"]
  end

  # Immediately deliver via channel
  def instant_broadcast_processing?
    true
  end

  # This is set by the +chat_messages_controller+
  def set_published_state
  end
end
