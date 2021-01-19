class AddUpcomingTime < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :scheduled_at, :datetime, null: true

    add_index :videos, [:state, :scheduled_at]
  end
end
