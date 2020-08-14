class LiveMessagesController < ApplicationController
  before_action :messages_params

  def create
    if user_signed_in?
      message = current_user.live_messages.new(messages_params)
      if message.save!
        ActionCable.server.broadcast "room_channel", 
          { text: message.body, user_name: current_user.full_name }
      end
    end
  end

  private

  def messages_params
    params.require(:messages).permit(:body)
  end
end