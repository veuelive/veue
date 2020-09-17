class DropChatMessages < ActiveRecord::Migration[6.0]
  def change
    drop_table :chat_messages do

    end
  end
end
