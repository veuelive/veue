class AddPublishedState < ActiveRecord::Migration[6.0]
  def change
    add_column :video_events, :published, :boolean, default: true

    add_index :video_events, [:video_id, :published, :timecode_ms, :type], name: :video_event_big_index
  end
end
