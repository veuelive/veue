# frozen_string_literal: true

module HttpAuthConcern
  extend ActiveSupport::Concern

  included do
    before_action :http_authenticate
  end

  def http_authenticate
    return true if Rails.env.development?
    return true if Rails.env.test?
    return true if ["veuelive.com", "www.veuelive.com"].include?(request.host)

    authenticate_or_request_with_http_basic do |username, password|
      username == "" && password == ENV["BASIC_AUTH_PASSWORD"]
    end
  end
end
