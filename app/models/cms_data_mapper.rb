# frozen_string_literal: true

# A data mapping class for ButterCMS meant to be inherited from to assign specific properties.
# When finding fields from a component, use hash based bracket ([]) or .dig accessors so it
# can be easily tested in model / view component tests instead of System Tests.
class CmsDataMapper
  include ActiveModel::Model

  attr_reader :cms_component, :fields

  # @param {OpenStruct | Hash} cms_component - Expects a ButterCMS component.
  def initialize(cms_component)
    @cms_component = cms_component
    @fields = cms_component[:fields]
  end

  def display_type
    @display_type ||= fields[:display_type]
  end

  def title
    @title ||= fields[:title]
  end

  def limit
    @limit ||= fields[:max_size]
  end
end
