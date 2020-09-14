# frozen_string_literal: true

module AuthenticationConcern
  extend ActiveSupport::Concern

  included do
    def current_ula
      ula_uuid = session[:ula_uuid]
      return unless ula_uuid

      @current_ula ||= UserLoginAttempt.where(ula_uuid: ula_uuid).active.includes(:user).first
    end
    helper_method :current_ula

    def current_user
      return unless current_ula

      @current_user ||= current_ula.user
    end

    helper_method :current_user

    def user_signed_in?
      current_user != nil
    end

    helper_method :user_signed_in?

    def authenticate_user!
      return true unless user_signed_in?

      render(status: :not_found, content: "")
      false
    end
  end
end
