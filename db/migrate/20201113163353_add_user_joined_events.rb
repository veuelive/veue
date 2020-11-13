class AddUserJoinedEvents < ActiveRecord::Migration[6.0]
  def change
    add_column :video_views, :user_joined_event_id, :uuid
    add_index :video_views, :user_joined_event_id
  end
end
