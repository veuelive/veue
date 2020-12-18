# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include HttpAuthConcern
  include AuthenticationConcern
  include IpcMockConcern unless Rails.env.production?
  layout false, only: [:not_found]
  private

  def xhr_request?
    request.xhr?&.zero?
  end
  helper_method :xhr_request?

  def not_found
    respond_to do |format|
      format.html { render "not_found"}
    end
  end
end
