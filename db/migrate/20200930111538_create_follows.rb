# frozen_string_literal: true

class CreateFollows < ActiveRecord::Migration[6.0]
  def change
    create_table :follows, id: :uuid do |t|
      t.uuid :follower_user_id, null: false
      t.uuid :streamer_user_id, null: false
      t.datetime :unfollowed_at

      t.timestamps
    end
    add_index :follows, :follower_user_id
    add_index :follows, :streamer_user_id
  end
end
