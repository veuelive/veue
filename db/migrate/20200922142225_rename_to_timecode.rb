class RenameToTimecode < ActiveRecord::Migration[6.0]
  def change
    rename_column :video_events, :timestamp_ms, :timecode_ms
  end
end
