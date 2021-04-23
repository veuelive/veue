class AddTimeInChatPayload < ActiveRecord::Migration[6.1]
  def change
    ChatMessage.all.each do |chat_message|
      chat_message.update(payload: chat_message.payload.merge({'time'=> (chat_message&.created_at)}))
    end
  end
end
