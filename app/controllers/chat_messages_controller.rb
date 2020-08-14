class ChatMessagesController < ApplicationController
  before_action :messages_params

  def create
    if user_signed_in?
      message = current_user.chat_messages.new(messages_params)
      message.save!
      ActionCable.server.broadcast "chat_room", 
        { text: message.body, user_name: current_user.full_name }
    end
  end

  private

  def messages_params
    params.require(:chat_message).permit(:body)
  end
end
