class DiscoverHero
  include DiscoverableComponent

  def link
    @fields.link
  end

  def image
    @fields.image
  end

  def to_partial_path
    "discover/hero"
  end
end
