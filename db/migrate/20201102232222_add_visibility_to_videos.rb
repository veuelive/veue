class AddVisibilityToVideos < ActiveRecord::Migration[6.0]
  def up
    execute <<-DDL
          CREATE TYPE visibility_setting AS ENUM (
            'public', 'protected', 'private'
          );
    DDL


    add_column :videos, :visibility, :visibility_setting
  end

  def down
    remove_column  :videos, :visibility
    execute "DROP type visibility_setting;"
  end
end
