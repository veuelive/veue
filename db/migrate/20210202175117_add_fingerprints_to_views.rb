class AddFingerprintsToViews < ActiveRecord::Migration[6.0]
  def change
    add_column :video_views, :fingerprint, :uuid

    add_index :video_views, [:fingerprint, :video_id]
  end
end
