class LastSeen < ActiveRecord::Migration[6.0]
  def change
    add_column :video_views, :last_seen_at, :datetime
    add_index :video_views, [:video_id, :last_seen_at]
  end
end
