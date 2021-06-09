# frozen_string_literal: true

class CmsChannelMapper < CmsDataMapper
  def channels
    return map_channel_slugs_to_channels.decorate if @component[:type] == "static_channels"

    queries.fetch(@fields[:type].to_s.underscore.to_sym, queries.fetch(:most_popular)).call.decorate
  end

  private

  def map_channel_slugs_to_channels
    channel_slugs = @fields.channels.map(&:slug)
    Channel.where(slug: channel_slugs)
  rescue ButterCMS::NotFound
    Rails.logger.error("Couldn't load static channels")
  end

  # Returns a hash of possible queries wrapped in procs so we dont invoke them until we're ready.
  def queries
    @queries ||= {most_popular: most_popular}
  end

  def most_popular
    proc { Channel.most_popular.limit(limit) }
  end
end
