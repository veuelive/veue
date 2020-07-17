class CreateMuxWebhooks < ActiveRecord::Migration[6.0]
  def change
    create_table :mux_webhooks do |t|
      t.belongs_to :stream
      t.string :event
      t.string :webhook_id
      t.datetime :event_at
      t.string :environment
      t.string :object_type
      t.string :object_id, index: true
      t.text :json

      t.timestamps
    end
  end
end
