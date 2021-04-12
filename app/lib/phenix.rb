# frozen_string_literal: true

# Capabilities reference https://phenixrts.com/docs/api/#supported-stream-capabilities

module Phenix
  def self.app_id
    ENV.fetch("PHENIX_APP_ID", "veue.tv")
  end

  def self.app_secret
    ENV.fetch("PHENIX_APP_SECRET", "")
  end

  def self.channel_alias(channel)
    channel.id[0..20]
  end

  module EdgeAuth
    def self.publishing_capabilities
      %w[uhd streaming on-demand multi-bitrate xhd fhd].join(",")
    end

    def self.auth_token(channel)
      build_token({authenticationOnly: nil, channelAlias: Phenix.channel_alias(channel)})
    end

    def self.publish_token(channel, video)
      build_token(
        publishingOnly: nil,
        channelAlias: Phenix.channel_alias(channel),
        capabilities: publishing_capabilities,
        applyTag: "videoId:#{video.id}",
      )
    end

    def self.stream_token(channel)
      build_token(
        streamingOnly: nil,
        channelAlias: Phenix.channel_alias(channel),
      )
    end

    def self.build_command(options={})
      options = options.reverse_merge(
        {
          applicationId: Phenix.app_id,
          secret: Phenix.app_secret,
        },
      )

      options =
        options.flat_map do |key, value|
          if value
            ["--#{key}", value]
          else
            "--#{key}"
          end
        end

      options.push("--expiresInSeconds")
      options.push("3600")

      %w[node node_modules/phenix-edge-auth/src/edgeAuth.js] + options
    end

    def self.build_token(options={})
      cmd = build_command(options)

      Rails.logger.debug(cmd.inspect)

      out, _err, _status = Open3.capture3(*cmd)
      out.split("\n").last
    end
  end

  module AdminApi
    def self.conn
      @conn ||=
        Faraday.new("https://pcast.phenixrts.com/pcast") do |conn|
          conn.basic_auth(Phenix.app_id, Phenix.app_secret)
        end
    end

    # This updates our webhook.... but note only ONE webhook PER environment
    #
    # Documentation: https://phenixrts.com/docs/api/#notifications
    #
    def self.update_webhook_url(url)
      uri = URI.parse(url)
      payload = {
        callback: {
          protocol: uri.scheme,
          host: uri.host,
          method: "POST",
          path: uri.path,
          query: uri.query,
        },
      }

      response = conn.put(
        "application/#{Phenix.app_id}/callback",
        payload.to_json,
        "Content-Type": "application/json",
      )

      response.status == 200
    end
  end

  module Webhooks
    def self.process(payload)
      Rails.logger.info payload.inspect

      ActiveRecord::Base.transaction do
        video = load_video(payload)

        unless video
          Rails.logger.warn "Unknown video ID #{video_id}"
          return
        end

        process_payload(video, payload)
      end
    end

    def self.load_video(payload)
      video_id = (payload["data"]["tags"].find do |tag|
        tag.start_with?("videoId")
      end)[8..]

      Video.find_by(id: video_id)
    end

    def self.process_payload(video, payload)
      case payload["what"]
      when "starting"
        video.start! unless video.live?
      when "ended"
        video.duration = payload["data"]["duration"] / 1_000
        video.end_reason = payload["data"]["reason"]
        video.end!
      when "on-demand"
        on_demand_payload(video, payload)
      else
        Rails.logger.info "Do nothing"
      end
    end

    def self.on_demand_payload(video, payload)
      uri = payload["data"]["uri"]
      if uri.ends_with?("vod.m3u8")
        video.hls_url = uri
      elsif uri.ends_with?("vod.mpd")
        video.dash_url = uri
      end

      # We can do VOD now!
      video.finish!
    end
  end
end
