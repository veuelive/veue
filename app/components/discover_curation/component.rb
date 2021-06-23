# frozen_string_literal: true

module DiscoverCuration
  class Component < ::ViewComponent::Base
    def initialize(title:, videos:, display_type: nil)
      super
      @title = title
      @videos = videos
      @display_type = ::ActiveSupport::StringInquirer.new(display_type || "grid")
    end

    def render?
      @videos.present? && @title.present?
    end
  end
end
