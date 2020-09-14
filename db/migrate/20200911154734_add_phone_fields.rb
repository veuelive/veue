class AddPhoneFields < ActiveRecord::Migration[6.0]
  def change
    User.destroy_all

    add_column :users, :phone_number_ciphertext, :text, null: false
    add_column :users, :phone_number_bidx, :string, index: true, unique: true

    add_column :users, :display_name, :string
  end
end
