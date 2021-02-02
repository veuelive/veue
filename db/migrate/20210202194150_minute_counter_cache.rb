class MinuteCounterCache < ActiveRecord::Migration[6.0]
  def change
    add_column :video_views, :video_view_minutes_count, :integer

    add_index :video_views, [:video_id, :video_view_minutes_count]
  end
end
