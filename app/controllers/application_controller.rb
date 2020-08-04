# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include HttpAuthConcern

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :setup_data_attributes

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(
      :sign_up,
      keys: %i[username name email password password_confirmation],
    )
    devise_parameter_sanitizer.permit(
      :sign_in,
      keys: %i[login password password_confirmation],
    )
    devise_parameter_sanitizer.permit(
      :account_update,
      keys: %i[username name email password_confirmation current_password],
    )
  end

  def setup_data_attributes
    @data_attributes = {}
  end
end
