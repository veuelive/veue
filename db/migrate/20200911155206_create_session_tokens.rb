class CreateSessionTokens < ActiveRecord::Migration[6.0]
  def change
    create_table :session_tokens do |t|
      t.text :uuid, index: true, unique: true, null: false
      t.text :phone_number_ciphertext
      t.string :phone_number_bidx, index: true
      t.belongs_to :user
      t.text :secret_code_ciphertext
      t.string :state, index: true
      t.inet :ip_address, index: true
      t.timestamps
    end
  end
end
