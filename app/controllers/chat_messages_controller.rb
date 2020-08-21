# frozen_string_literal: true

class ChatMessagesController < ApplicationController
  before_action :messages_params, only: [:create]
  before_action :authenticate_user!, only: [:create]
  before_action :set_video, only: [:grouped_message]
  before_action :set_chat_message, only: [:grouped_message]

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

  # It will be used to group messages on frontend for each user's consecutive messages
  # Get User of @message and user's messages list
  # Check if last message was present in this list
  def grouped_message
    messages = @message.user.chat_messages
    render(json: {grouped: messages.include?(@video.chat_messages.where.not(id: @message.id).last)})
  end

  private

  def set_chat_message
    @message = ChatMessage.find(params[:chat_message_id])
  end

  def set_video
    @video = Video.find(params[:video_id])
  end

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
