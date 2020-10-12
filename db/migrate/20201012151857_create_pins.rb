class CreatePins < ActiveRecord::Migration[6.0]
  def change
    create_table :pins, id: :uuid do |t|
      t.string :url
      t.string :name

      t.bigint :timecode_ms

      t.uuid :video_id, foreign_key: true
      t.uuid :pin_event_id, index: true

      t.timestamps
    end
  end
end
