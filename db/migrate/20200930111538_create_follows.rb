# frozen_string_literal: true

class CreateFollows < ActiveRecord::Migration[6.0]
  def change
    create_table :follows, id: :uuid do |t|
      t.uuid :follower_id, null: false
      t.uuid :streamer_id, null: false
      t.datetime :unfollowed_at

      t.timestamps
    end
    add_index(
      :follows,
      [:follower_id, :streamer_id, :unfollowed_at],
      unique: true,
    )
  end
end
