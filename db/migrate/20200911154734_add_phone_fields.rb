class AddPhoneFields < ActiveRecord::Migration[6.0]
  def change
    User.destroy_all

    add_column :users, :phone_number_ciphertext, :text, null: false
    add_column :users, :phone_number_bidx, :string, index: true, unique: true
    add_column :users, :phone_number_country, :string, limit: 3

    add_column :users, :display_name, :string
    add_column :users, :state, :string

    add_column :users, :username, :string, index: true, null: true, unique: true
  end
end
