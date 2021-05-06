# frozen_string_literal: true

module Components
  module Discover
    class Hero
      include DiscoverableComponent

      def link
        @fields.link
      end

      def image
        @fields.image
      end

      def to_partial_path
        "discover/components/hero"
      end
    end
  end
end
