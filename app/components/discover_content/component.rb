# frozen_string_literal: true

module DiscoverContent
  class Component < ::ViewComponent::Base
    def initialize(body:)
      super
      @body = body
    end

    def render?
      @body.present?
    end
  end
end
