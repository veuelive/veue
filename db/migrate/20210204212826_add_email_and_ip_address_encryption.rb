class AddEmailAndIpAddressEncryption < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :email_ciphertext, :text
    add_column :session_tokens, :ip_address_ciphertext, :text

    add_column :users, :email_bidx, :string
    add_index :users, :email_bidx, unique: true

    add_column :session_tokens, :ip_address_bidx, :inet
    add_index :session_tokens, :ip_address_bidx
  end
end
