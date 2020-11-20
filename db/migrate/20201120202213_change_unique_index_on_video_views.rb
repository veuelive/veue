class ChangeUniqueIndexOnVideoViews < ActiveRecord::Migration[6.0]
  def change
    remove_index :video_views, [:video_id, :details]
    add_index :video_views, [:video_id, :details, :user_id], unique: true
  end
end
