class CreateVideoSnapshots < ActiveRecord::Migration[6.1]
  def change
    create_table :video_snapshots, id: :uuid do |t|
      t.references :video, null: false, foreign_key: true, type: :uuid
      t.bigint :timecode
      t.integer :viewer_count
      t.string :device_id
      t.string :device_type

      t.timestamps
    end
  end
end
