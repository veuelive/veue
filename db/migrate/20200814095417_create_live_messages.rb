class CreateLiveMessages < ActiveRecord::Migration[6.0]
  def change
    create_table :live_messages do |t|
      t.text :body
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
