class AddColumnBrowserBroadcastToVideo < ActiveRecord::Migration[6.1]
  def change
    add_column :videos, :browser_broadcast, :boolean, default: false, null: false
  end
end
