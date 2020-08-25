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

    render(json: {success: true})
  end

  private

  def build_chat_message
    current_user.chat_messages.new(messages_params)
  end

  def messages_params
    params.require(:chat_message).permit(:body, :video_id)
  end
end
