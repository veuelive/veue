# frozen_string_literal: true

class DiscoverContent
  include DiscoverableComponent

  def initialize(component)
    @component = component
    @fields = @component.fields
  end

  def body
    @fields.body
  end

  def to_partial_path
    "discover/content"
  end
end
