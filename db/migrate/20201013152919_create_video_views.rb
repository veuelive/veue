class CreateVideoViews < ActiveRecord::Migration[6.0]
  def change
    create_table :video_views, id: :uuid do |t|
      t.uuid :user_id, foreign_key: true
      t.uuid :video_id, null: false, foreign_key: true
      t.jsonb :details

      t.timestamps
    end
  end
end
