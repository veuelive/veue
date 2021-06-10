# frozen_string_literal: true

module Components
  module Discover
    class Content
      include DiscoverableComponent

      def body
        @fields.body
      end

      def to_partial_path
        "discover/components/content"
      end
    end
  end
end
