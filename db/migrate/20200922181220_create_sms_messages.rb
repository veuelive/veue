class CreateSmsMessages < ActiveRecord::Migration[6.0]
  def change
    create_table :sms_messages do |t|
      t.belongs_to :session_token, null: true
      t.text :text_ciphertext
      t.string :from
      t.text :to_ciphertext
      t.string :to_bidx, index: true
      t.integer :price_in_cents
      t.string :service, index: true
      t.string :status, index: true

      t.timestamps
    end
  end
end
