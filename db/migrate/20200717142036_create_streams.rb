class CreateStreams < ActiveRecord::Migration[6.0]
  def change
    create_table :streams do |t|
      t.string :slug, index: true, uniqueness: true, limit: 21
      t.belongs_to :user
      t.string :stream_key
      t.string :name
      t.string :state, index: true

      t.timestamps
    end
  end
end
