class AddSlugToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, "slug", :string, unique: true, index: true
    add_index :users, [:slug], unique: true
  end
end
