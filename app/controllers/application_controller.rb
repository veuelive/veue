# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include HttpAuthConcern
  include AuthenticationConcern
  include IpcMockConcern unless Rails.env.production?

  private

  def is_xhr_request?
    request.xhr? == 0
  end
  helper_method :is_xhr_request?
end
