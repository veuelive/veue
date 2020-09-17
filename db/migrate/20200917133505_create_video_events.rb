class CreateVideoEvents < ActiveRecord::Migration[6.0]
  def change
    create_table :video_events do |t|
      t.belongs_to :video
      t.bigint :timestamp_ms
      t.string :type, index: true
      t.jsonb :input # This is what WE got from the client on creation
      t.jsonb :payload # This is what we SEND to clients publicly after (most likely mutated somehow)
      t.belongs_to :user
      t.timestamps
    end

    add_index :video_events, [:video_id, :timestamp_ms]
    add_index :video_events, [:video_id, :type]
  end
end
