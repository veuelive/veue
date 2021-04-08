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
    def self.default_publishing_capabilities
      %w[uhd streaming on-demand multi-bitrate sd xhd fhd].join(", ")
    end

    def self.auth_token(channel)
      build_token({authenticationOnly: nil, channelAlias: Phenix.channel_alias(channel)})
    end

    def self.publish_token(channel, video)
      build_token(
        publishingOnly: nil,
        channelAlias: Phenix.channel_alias(channel),
        capabilities: default_publishing_capabilities,
        applyTag: "videoId:#{video.id}",
      )
    end

    def self.stream_token(channel)
      build_token(
        streamingOnly: nil,
        channelAlias: Phenix.channel_alias(channel),
      )
    end

    def self.build_token(options={})
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

      cmd = %w[node node_modules/phenix-edge-auth/src/edgeAuth.js] + options

      options.push("--expiresIn")
      options.push("3600")

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
end
