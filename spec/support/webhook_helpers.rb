# frozen_string_literal: true

module WebhookHelpers
  def mux_webhooks
    @mux_webhooks ||=
      Dir[Rails.root.join("spec/support/webhooks/*.json")].sort.map do |file|
        JSON.parse(File.read(file))
      end
  end
end
