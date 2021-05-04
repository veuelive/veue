class AddColumnBioToChannel < ActiveRecord::Migration[6.1]
  def change
    add_column :channels, :bio, :text
  end
end
