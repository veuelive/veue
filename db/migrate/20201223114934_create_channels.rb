class CreateChannels < ActiveRecord::Migration[6.0]
  def change
    create_table :channels, id: :uuid do |t|
      t.uuid :user_id, foreign_key_column_for: :users
      t.string :name, null: false
      t.string :slug, null: false, unique: true
      t.string :mux_live_stream_id, unique: true
      t.text :mux_stream_key_ciphertext

      t.timestamps
    end
    add_column :videos, :channel_id, :uuid

    add_index :channels, :slug, unique: true
    add_index :channels, :name, unique: true
    add_index :channels, :mux_live_stream_id, unique: true
  end
end
