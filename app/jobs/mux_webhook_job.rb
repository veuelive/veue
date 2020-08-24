# frozen_string_literal: true

class MuxWebhookJob < ApplicationJob
  queue_as :default

  def perform(webhook)
    check_preconditions(webhook) do
      logger.info "Processing event #{webhook.event}"
      process_webhook(webhook)
      process_target(webhook)
    end
  end

  private

  def check_preconditions(webhook, &block)
    return if webhook.finished_processing_at

    if (webhook.mux_target&.latest_mux_webhook_at || Time.zone.at(0)) > webhook.event_received_at
      logger.warn "Processed webhook too late #{webhook.id} / #{webhook.mux_id}"
    else
      block.call
    end
  end

  def process_webhook(webhook)
    method_name = "process_#{webhook.event_name}_event!"

    if webhook.respond_to?(method_name)
      webhook.__send__(method_name)
    else
      logger.debug("nothing to do for webhook of event #{webhook.event_name} / #{webhook.mux_id}")
    end

    webhook.finished_processing_at = Time.now.utc

    # No need to save inside of the MuxWebhook#process! function because we do it here!
    webhook.save!
  end

  def process_target(webhook)
    target = webhook.mux_target

    if target.blank?
      logger.debug("No playback information")
    else
      target.latest_mux_webhook_at = webhook.event_received_at
      public_playback(target, webhook)
      target.mux_status = webhook.payload["status"]

      target.save!
    end
  end

  def public_playback(target, webhook)
    playback = webhook.payload["playback_ids"]&.find { |playback| playback["policy"] == "public" }
    target.mux_playback_id = playback["id"] if playback
  end
end
