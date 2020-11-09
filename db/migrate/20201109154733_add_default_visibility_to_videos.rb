class AddDefaultVisibilityToVideos < ActiveRecord::Migration[6.0]
  def up
    execute "ALTER TABLE videos ALTER COLUMN visibility SET DEFAULT 'public'"
    Video.update_all(:visibility => 'public')
  end
end
