class BroadcastStartedAtMs < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :started_at_ms, :bigint
  end
end
