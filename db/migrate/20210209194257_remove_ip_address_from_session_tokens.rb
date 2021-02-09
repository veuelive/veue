class RemoveIpAddressFromSessionTokens < ActiveRecord::Migration[6.0]
  def change
    remove_column :session_tokens, :ip_address, :inet
  end
end
