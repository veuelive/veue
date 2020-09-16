# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include HttpAuthConcern
  include AuthenticationConcern
  include IpcMockConcern if Rails.env.test?
end
