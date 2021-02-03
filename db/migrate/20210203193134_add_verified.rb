class AddVerified < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :verified, :boolean, default: false
    add_column :channels, :verified, :boolean, default: false
    add_index :channels, :verified
    add_index :users, :verified
  end
end
