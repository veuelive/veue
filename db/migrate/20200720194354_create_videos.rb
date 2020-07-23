# frozen_string_literal: true

class CreateVideos < ActiveRecord::Migration[6.0]
  def change
    create_table :videos do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.string :slug
      t.string :title
      t.string :mux_playback_id
      t.string :state, index: true
      t.belongs_to :mux_live_stream

      t.timestamps
    end
  end
end
