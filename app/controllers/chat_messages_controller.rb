class ChatMessagesController < ApplicationController
  before_action :messages_params

  def create
    if user_signed_in?
      message = current_user.chat_messages.new(messages_params)
      if message.save
        ActionCable.server.broadcast "chat_room", 
          { text: message.body, user_name: current_user.full_name, video_id: message.video_id }
        return render json: { success: true }
      else
        return render json: { success: false, error_messages: message.errors.full_messages }
      end
    end
  end

  private

  def messages_params
    params.require(:chat_message).permit(:body, :video_id)
  end
end
