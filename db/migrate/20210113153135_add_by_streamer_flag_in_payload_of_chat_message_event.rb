class AddByStreamerFlagInPayloadOfChatMessageEvent < ActiveRecord::Migration[6.0]
  def change
    ChatMessage.all.each do |message|
      message.set_payload
      message.save
    end
  end
end
