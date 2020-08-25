# frozen_string_literal: true

class ChatMessage < ApplicationRecord
  belongs_to :user
  belongs_to :video

  validates :body, presence: true

  after_create :broadcast_message

  private

  def broadcast_message
    ActionCable.server.broadcast(
      "live_video_#{video_id}",
      {
        text: body,
        user_id: user.id,
        user_name: user.username,
        video_id: video_id,
      },
    )
  end

  def json_body(message); end
end
