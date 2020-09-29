# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include HttpAuthConcern
  include AuthenticationConcern
  include IpcMockConcern unless Rails.env.production?

  protected

  def skip_navbar
    @skip_nav = true
  end
end
