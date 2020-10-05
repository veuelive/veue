# frozen_string_literal: true

class MuxWebhookJob < ApplicationJob
  queue_as :default

  def perform(webhook)
    logger.info "Processing event #{webhook.event_type}"
    process_webhook(webhook)
  end

  private

  def process_live_stream_active(webhook)
    if webhook.video.may_go_live?
      webhook.video.change_playback_id(webhook.playback_id)
      webhook.video.go_live!
    else
      webhook.log_webhook_error("video cannot transition to live")
    end
  end

  def process_live_stream_completed(webhook)
    # When the asset tells us the live stream is over, we need to change our
    # playback ID to not be the livestream version anymore
    webhook.video.change_playback_id(webhook.video.mux_asset_playback_id)
    webhook.video.finish!
  end

  def process_asset_ready(webhook)
    # We get this relatively early in the process and will need to save it later.
    webhook.video.update(
      mux_asset_playback_id: webhook.playback_id,
      mux_asset_id: webhook.payload["object"]["id"],
    )
  end

  def process_webhook(webhook)
    _, type, event_name = webhook.event_type.split(".")

    case type
    when "live_stream"
      process_live_stream_active(webhook) if event_name == "active"
    when "asset"
      process_asset_ready(webhook) if event_name == "ready"
      process_live_stream_completed(webhook) if event_name == "live_stream_completed"
    else
      webhook.log_webhook_error("Unknown webhook type")
    end

    webhook.finished_processing_at = Time.now.utc

    # No need to save inside of the MuxWebhook#process! function because we do it here!
    webhook.save!
  end
end
