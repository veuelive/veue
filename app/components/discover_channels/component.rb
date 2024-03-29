# frozen_string_literal: true

module DiscoverChannels
  class Component < ::ViewComponent::Base
    def initialize(title:, channels:)
      super
      @title = title
      @channels = channels
    end

    def render?
      @channels.present? && @title.present?
    end
  end
end
