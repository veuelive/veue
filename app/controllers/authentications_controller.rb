# frozen_string_literal: true

class AuthenticationsController < ApplicationController
  def create
    return unless params[:session_uuid]

    attempt = UserLoginAttempt.active.where(session_uuid: params[:session_uuid]).first
    session[:session_uuid] = attempt.session_uuid
  end
end
