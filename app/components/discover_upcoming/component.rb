# frozen_string_literal: true

module DiscoverUpcoming
  class Component < ::ViewComponent::Base
    def initialize(title:, shows:)
      super
      @title = title
      @shows = shows
    end

    def render?
      @title.present? && @shows.present?
    end
  end
end
