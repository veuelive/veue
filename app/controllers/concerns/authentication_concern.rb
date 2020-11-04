# frozen_string_literal: true

module AuthenticationConcern
  extend ActiveSupport::Concern

  included do
    def current_session_token
      session_token_uuid = (session[:session_token_uuid] ||= request.headers["X-Bearer-Token"])
      return unless session_token_uuid

      @current_session_token ||= SessionToken.where(uuid: session_token_uuid).active.includes(:user).first
    end
    helper_method :current_session_token

    def current_user
      return unless current_session_token

      @current_user ||= current_session_token.user
    end
    helper_method :current_user

    def user_signed_in?
      current_user != nil
    end
    helper_method :user_signed_in?

    def authenticate_user!
      return true if user_signed_in?

      render(status: :unauthorized, html: "")
      false
    end
  end
end
