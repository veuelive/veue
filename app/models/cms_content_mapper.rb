# frozen_string_literal: true

class CmsContentMapper < CmsDataMapper
  def view_component
    DiscoverContent::Component.new(body: body)
  end

  def body
    @body ||= fields[:body]
  end
end
