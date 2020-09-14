class CreateUserLoginAttempts < ActiveRecord::Migration[6.0]
  def change
    create_table :user_login_attempts do |t|
      t.text :phone_number_ciphertext
      t.string :phone_number_bidx, index: true
      t.belongs_to :user
      t.text :secret_code_ciphertext
      t.text :session_uuid_ciphertext
      t.string :session_uuid_bidx, index: true
      t.string :state, index: true
      t.inet :ip_address, index: true
      t.timestamps
    end
  end
end
