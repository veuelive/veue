class ApplicationController < ActionController::Base
    include HttpAuthConcern

    before_action :configure_permitted_parameters, if: :devise_controller?

    def configure_permitted_parameters
        devise_parameter_sanitizer.permit(:sign_up,
                                          keys: [:username, :name, :email, :password, :password_confirmation])
        devise_parameter_sanitizer.permit(:sign_in,
                                          keys: [:login, :password, :password_confirmation])
        devise_parameter_sanitizer.permit(:account_update,
                                          keys: [:username, :name, :email, :password_confirmation, :current_password])
    end
end
