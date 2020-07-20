class CreateMuxWebhooks < ActiveRecord::Migration[6.0]
  def change
    create_table :mux_webhooks do |t|
      t.belongs_to :mux_target, polymorphic: true, index: true
      t.string :type
      t.string :event
      t.string :webhook_id
      t.datetime :event_at
      t.string :environment
      t.text :json

      t.timestamps
    end
  end
end
