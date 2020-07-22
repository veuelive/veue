# frozen_string_literal: true

class CreateMuxLiveStreams < ActiveRecord::Migration[6.0]
  def change
    create_table :mux_live_streams do |t|
      t.belongs_to :user, index: false

      t.string :mux_status

      t.string :mux_id, index: true
      t.string :stream_key
      t.string :playback_id

      t.datetime :latest_mux_webhook_at

      t.timestamps

      t.index %i[user_id mux_status]
    end
  end
end
