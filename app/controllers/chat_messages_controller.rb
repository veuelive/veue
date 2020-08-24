# frozen_string_literal: true

class ChatMessagesController < ApplicationController
  before_action :messages_params, only: [:create]
  before_action :authenticate_user!, only: [:create]

  def create
    message = build_chat_message

    unless message.save
      render(json: {success: false, error_messages: message.errors.full_messages})
      return
    end

    ActionCable.server.broadcast(
      "live_video_#{message.video_id}",
      json_body(message),
    )
    render(json: {success: true})
  end

  private

  def build_chat_message
    current_user.chat_messages.new(messages_params)
  end

  def messages_params
    params.require(:chat_message).permit(:body, :video_id)
  end

  def json_body(message)
    {
      id: message.id,
      text: message.body,
      user_id: current_user.id,
      user_name: current_user.full_name,
      video_id: message.video_id,
    }
  end
end
