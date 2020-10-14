# frozen_string_literal: true

module BrowserDetectionConcern
  extend ActiveSupport::Concern

  included do
    def browser_name
      user_agent = request.user_agent
      case user_agent
      when /Chrome/
        "Chrome"
      when /Firefox/
        "Firefox"
      when /Opera/
        "Opera"
      when /MSIE/
        "Internet Explorer"
      else
        user_agent
      end
    end
  end
end
