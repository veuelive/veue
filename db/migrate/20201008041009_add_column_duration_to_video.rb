class AddColumnDurationToVideo < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :duration, :integer
  end
end
