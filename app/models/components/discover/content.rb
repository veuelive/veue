# frozen_string_literal: true

module Components
  module Discover
    class Content
      include DiscoverableComponent

      def initialize(component)
        @component = component
        @fields = @component.fields
      end

      def body
        @fields.body
      end

      def to_partial_path
        "discover/components/content"
      end
    end
  end
end
