# frozen_string_literal: true

# For database-less discover components to define a cache key
module DiscoverableComponent
  extend ActiveSupport::Concern

  included do
    include ActiveModel::Model
    attr_reader :component, :fields, :type

    def initialize(component)
      @component = component
      @fields = component.fields
      @type = component.type
    end
  end
end
