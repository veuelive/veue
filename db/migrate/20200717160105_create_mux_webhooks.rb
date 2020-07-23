# frozen_string_literal: true

class CreateMuxWebhooks < ActiveRecord::Migration[6.0]
  def change
    create_table :mux_webhooks do |t|
      t.belongs_to :mux_target, polymorphic: true, index: true
      t.string :type
      t.string :event
      t.string :mux_id, unique: true # Should be for idempotence
      t.datetime :event_received_at
      t.datetime :finished_processing_at
      t.string :mux_environment
      t.string :mux_request_id
      t.json :payload

      t.timestamps
    end
  end
end
