class ChangeWebhooksToPointDirectly < ActiveRecord::Migration[6.0]
  def change
    add_column :mux_webhooks, :user_id, :uuid
    add_column :mux_webhooks, :video_id, :uuid
    add_column :mux_webhooks, :event_type, :string
    add_column :videos, :mux_asset_playback_id, :string

    remove_index :mux_webhooks, %w[mux_target_type mux_target_id]
    remove_column :mux_webhooks, :mux_target_type, :string
    remove_column :mux_webhooks, :mux_target_id, :string
    remove_column :mux_webhooks, :type, :string
    remove_column :mux_webhooks, :event, :string

    add_index :mux_webhooks, :video_id
    add_index :mux_webhooks, :user_id
  end
end
