class Nullvideo < ActiveRecord::Migration[6.0]
  def change
    change_column :mux_assets, :video_id, :bigint, null: true
  end
end
