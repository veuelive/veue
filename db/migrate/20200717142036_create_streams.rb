class CreateStreams < ActiveRecord::Migration[6.0]
  def change
    create_table :streams do |t|
      t.string :slug, index: true, uniqueness: true, limit: 21
      t.belongs_to :user
      t.string :stream_key
      t.string :mux_live_stream_id, index: true
      t.string :mux_asset_id, index: true
      t.string :mux_playback_id, index: true
      t.string :mux_asset_state
      t.string :mux_live_stream_state, index: true
      t.string :name
      t.string :state, index: true

      t.timestamps
    end
  end
end
