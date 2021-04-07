class CreateVideoCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :video_categories, id: :uuid do |t|
      t.belongs_to :category, foreign_key: true, type: :uuid
      t.belongs_to :video, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
