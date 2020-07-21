# frozen_string_literal: true

class MuxWebhookJob < ApplicationJob
  queue_as :default

  def perform(webhook)
    return unless webhook.mux_target

    # Since we are in a background target, we want to make sure there
    # isn't a stale version of our target!
    webhook.mux_target.reload

    # Delegate back to the STI-based webhook!
    webhook.process!
  end
end
