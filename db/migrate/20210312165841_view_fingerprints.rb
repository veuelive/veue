class ViewFingerprints < ActiveRecord::Migration[6.1]
  def change
    remove_index :video_views, [:video_id, :user_id]
    add_index :video_views, [:video_id, :fingerprint, :user_id], unique: true
  end
end
