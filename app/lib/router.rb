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

  # Workaround for processed image urls. It uses url_for in dev, and the s3 url in prod.
  # @param {ActiveStorage::Variant} image - A processed variant
  # @example
  #   image = video.primary_shot.variant(resize_to_limit: [500, 500]).processed
  #   Router.url_for_variant(image)
  def self.url_for_variant(image)
    return unless image

    if Rails.application.config.active_storage.service == :amazon
      # if using S3, use the S3 url directly
      image.url
    else
      # this is for test / local envs.
      Router.url_for(image)
    end
  end
end
