# frozen_string_literal: true

module AuthenticationConcern
  extend ActiveSupport::Concern

  included do
    def current_user
      session_uuid = session[:session_uuid]
      return unless session_uuid

      @current_user ||= UserLoginAttempt.where(session_uuid: session_uuid).active.includes(:user).first.user
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
