class CreateModerationItems < ActiveRecord::Migration[6.0]
  def change
    create_table :moderation_items, id: :uuid do |t|
      t.text :text
      t.jsonb :scores
      t.float :summary_score
      t.string :state
      t.integer :processing_time
      t.belongs_to :video_event, null: true, type: :uuid
      t.belongs_to :user, null: true, type: :uuid
      t.belongs_to :video, null: true, type: :uuid
      t.timestamps
    end
  end
end
