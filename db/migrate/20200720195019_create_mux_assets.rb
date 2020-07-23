# frozen_string_literal: true

class CreateMuxAssets < ActiveRecord::Migration[6.0]
  def change
    create_table :mux_assets do |t|
      t.string :mux_status

      t.string :mux_id, index: true
      t.string :playback_id
      t.belongs_to :video, null: false, foreign_key: true

      t.float :duration
      t.string :max_stored_resolution
      t.float :max_stored_frame_rate
      t.string :aspect_ratio
      t.boolean :per_title_encode
      t.boolean :is_live

      t.datetime :latest_mux_webhook_at

      t.datetime :deleted_at

      t.timestamps
    end
  end
end
