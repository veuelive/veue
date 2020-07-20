class CreateVideos < ActiveRecord::Migration[6.0]
  def change
    create_table :videos do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.string :title
      t.string :state, index: true
      t.belongs_to :mux_live_stream

      t.timestamps
    end
  end
end
