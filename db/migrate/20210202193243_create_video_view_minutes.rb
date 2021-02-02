class CreateVideoViewMinutes < ActiveRecord::Migration[6.0]
  def change
    create_table :video_view_minutes, id: :uuid do |t|
      t.belongs_to :video_view, type: :uuid
      t.integer :minute
      t.boolean :is_live
      t.timestamps
    end
  end
end
