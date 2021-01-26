class CreateModerationItems < ActiveRecord::Migration[6.0]
  def change
    create_table :moderation_items, id: :uuid do |t|
      t.text :text
      t.jsonb :scores
      t.float :summary_score
      t.string :state
      t.integer :processing_time
      t.uuid :video_event_id, null: true
      t.uuid :user_id, null: true
      t.uuid :video_id, null: true
      t.timestamps
    end
  end
end
