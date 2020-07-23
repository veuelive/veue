
module WebhookHelpers
  def mux_webhooks
    @mux_webhooks ||=
      Dir[Rails.root + "spec/webhooks/*.json"].sort.map do |file|
        JSON.parse(File.read(file))
      end
  end
end
