# frozen_string_literal: true

class ChatMessagesController < ApplicationController
  before_action :messages_params

  def create
    return unless user_signed_in?

    message = current_user.chat_messages.new(messages_params)
    if message.save
      ActionCable.server.broadcast(
        "chat_room",
        {text: message.body, user_name: current_user.full_name, video_id: message.video_id},
      )
      render(json: {success: true})
    else
      render(json: {success: false, error_messages: message.errors.full_messages})
    end
  end

  private

  def messages_params
    params.require(:chat_message).permit(:body, :video_id)
  end
end
