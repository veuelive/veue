class RemoveIpAddressFromSessionTokens < ActiveRecord::Migration[6.0]
  def change
    remove_column :session_tokens, :ip_address
    remove_index :session_tokens, name: "index_session_tokens_on_ip_address"
  end
end
