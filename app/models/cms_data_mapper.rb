# A data mapping class for ButterCMS meant to be inherited from to assign specific properties.
# When finding fields from a component, use hash based bracket ([]) or .dig accessors so it
# can be easily tested in model / view component tests instead of System Tests.
class CmsDataMapper
  include ActiveModel::Model

  def initialize(component)
    @component = component
    @fields = component[:fields]
  end

  def limit
    @limit ||= @fields[:max_size]
  end

  def title
    @title ||= @fields[:title]
  end
end
