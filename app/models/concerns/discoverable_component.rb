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

    # Determines the uniqueness of our model for caching since theyre "db-less"
    def cache_key
      Digest::MD5.hexdigest("#{self.class}-#{@component}-#{@fields}")
    end
  end
end
