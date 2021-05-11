class AddScheduleToChannel < ActiveRecord::Migration[6.1]
  def change
    add_column :channels, :schedule, :json, default: {}
    add_column :channels, :next_show_at, :datetime
  end
end
