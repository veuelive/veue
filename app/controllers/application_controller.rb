# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include HttpAuthConcern
  include AuthenticationConcern
  include IpcMockConcern if Rails.env.test?

  protected

  def skip_navbar
    @skip_nav = true
  end
end
