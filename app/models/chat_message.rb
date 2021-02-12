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

  def set_published_state
    item = moderation_items.create(
      video: video,
      user: user,
      text: text,
    )

    return self.published = false unless item.persisted?

    item.fetch_scores!
    self.published = item.approved?
  end
end
