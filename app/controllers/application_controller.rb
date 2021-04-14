# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include HttpAuthConcern
  include AuthenticationConcern
  include FingerprintConcern
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  rescue_from CanCan::AccessDenied do |exception|
    respond_to do |format|
      format.json { render nothing: true, status: :not_found }
      format.html { render "layouts/not_found", status: :not_found, locals: {object: exception.subject} }
      format.js   { render nothing: true, status: :not_found }
    end
  end

  private

  def xhr_request?
    request.xhr?
  end
  helper_method :xhr_request?

  def record_not_found
    render(plain: "404 Not Found", status: :not_found)
  end
end
