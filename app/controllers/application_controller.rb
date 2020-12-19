# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include HttpAuthConcern
  include AuthenticationConcern
  include IpcMockConcern unless Rails.env.production?
  private

  def xhr_request?
    request.xhr?&.zero?
  end
  helper_method :xhr_request?
end
