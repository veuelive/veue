class AddReferenceToMuxWebhooksForChannels < ActiveRecord::Migration[6.0]
  def change
    add_reference :mux_webhooks, :channel, type: :uuid, index: true
  end
end
