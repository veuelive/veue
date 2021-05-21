# frozen_string_literal: true

module Components
  module Discover
    class Upcoming
      include DiscoverableComponent

      def initialize(component)
        @component = component
        @fields = @component.fields
        @limit = @fields.max_size || 8
      end

      def to_partial_path
        "discover/components/upcoming"
      end

      def title
        @fields.title
      end

      def collection
        return map_channel_names_to_channels(component) if @fields.type == "static_upcoming"

        find_channels
      end

      def find_channels
        Channel.most_popular.where.not(next_show_at: nil).limit(@limit).decorate
      end

      def map_channel_names_to_channels
        upcoming_slugs = @fields.upcoming_broadcasts.map(&:slug)

        Channel.where(slug: upcoming_slugs).where.not(next_show_at: nil).decorate
      end
    end
  end
end
