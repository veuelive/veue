# frozen_string_literal: true

# A top-level namespace for using Rails URL helpers.
# @example
#   Router.root_path
#   Router.user_path(user)
#
# @see https://www.dwightwatson.com/posts/accessing-rails-routes-helpers-from-anywhere-in-your-app
module Router
  class << self
    include Rails.application.routes.url_helpers
  end

  def self.default_mailer_url_options
    Rails.application.config.action_mailer.default_url_options
  end

  def self.default_url_options
    Rails.application.routes.default_url_options
  end
end
