# frozen_string_literal: true

# Capabilities reference https://phenixrts.com/docs/api/#supported-stream-capabilities

module PhenixEdgeAuth
  def self.default_publishing_capabilities
    %w[uhd streaming on-demand multi-bitrate sd xhd fhd].join(", ")
  end

  def self.app_id
    ENV.fetch("PHENIX_APP_ID", "veue.tv")
  end

  def self.app_secret
    ENV.fetch("PHENIX_APP_SECRET", "")
  end

  def self.auth_token(channel_id)
    build_token({authenticationOnly: nil, channelAlias: channel_id})
  end

  def self.publish_token(channel_id, video_id)
    build_token(
      publishingOnly: nil,
      channelAlias: channel_id,
      capabilities: default_publishing_capabilities,
      applyTag: "videoId:#{video_id}",
    )
  end

  def self.stream_token(channel_id)
    build_token(
      streamingOnly: nil,
      channelAlias: channel_id,
    )
  end

  def self.build_token(options={})
    options = options.reverse_merge(
      {
        applicationId: app_id,
        secret: app_secret,
        expiresInSeconds: 3600,
      },
    )

    options =
      options.map do |key, value|
        if value
          "--#{key} #{value.inspect}"
        else
          "--#{key}"
        end
      end

    cmd = %(node node_modules/phenix-edge-auth/src/edgeAuth.js #{options.join(' ')})

    Rails.logger.debug(cmd)

    `#{cmd.gsub("\n", "")}`.split("\n").last
  end
end
