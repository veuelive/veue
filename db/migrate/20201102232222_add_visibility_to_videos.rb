class AddVisibilityToVideos < ActiveRecord::Migration[6.0]
  def up
    create_enum "visibility_setting", %w[public protected private]
    add_column :videos, :visibility, :visibility_setting
  end

  def down
    remove_column :videos, :visibility
    drop_enum "visibility_setting"
  end
end
