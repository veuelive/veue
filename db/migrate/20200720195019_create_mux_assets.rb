# frozen_string_literal: true

class CreateMuxAssets < ActiveRecord::Migration[6.0]
  def change
    create_table :mux_assets do |t|
      t.string :state # for Veue state
      t.string :mux_id, index: true
      t.string :playback_id
      t.belongs_to :user, null: false, foreign_key: true
      t.belongs_to :video, null: false, foreign_key: true

      t.string :mux_status # to record last status from Mux
      t.float :duration
      t.string :max_stored_resolution
      t.float :max_stored_frame_rate
      t.string :aspect_ratio
      t.boolean :per_title_encode
      t.boolean :is_live

      t.datetime :deleted_at

      t.timestamps
    end
  end
end
