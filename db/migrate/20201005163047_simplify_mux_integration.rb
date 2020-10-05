class SimplifyMuxIntegration < ActiveRecord::Migration[6.0]
  def change
    drop_table :mux_assets
    drop_table :mux_live_streams

    remove_column :users, :mux_live_stream_id, :uuid
    add_column :users, :mux_live_stream_id, :string
    add_column :users, :mux_stream_key_ciphertext, :text
    add_column :videos, :mux_asset_id, :string

    add_index :users, :mux_live_stream_id
    add_index :videos, :mux_asset_id
  end
end
