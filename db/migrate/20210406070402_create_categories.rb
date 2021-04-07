class CreateCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :categories, id: :uuid do |t|
      t.string :title
      t.belongs_to :category, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
