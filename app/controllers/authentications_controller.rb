# frozen_string_literal: true

class AuthenticationsController < ApplicationController
  def create
    session[:session_token_uuid] = nil
    @ula = SessionToken.new(phone_number: params[:phone_number])
    @ula.save!
    render_modal
  end

  def update
    ula = SessionToken.find_by(uuid: params[:session_token_uuid])
    render_modal and return unless ula&.process_secret_code!(params[:secret_code])

    session[:session_token_uuid] = ula.uuid
    render_modal and return if ula.user.nil?

    render_navbar
  end

  # This is used for when we've forgotten who we are, but we want ot use
  # a previously created UserLoginAttempt
  def override
    return unless params[:session_token_uuid]

    session_token = SessionToken.where(uuid: params[:session_token_uuid]).active.first
    session[:session_token_uuid] = session_token.uuid
  end

  def destroy
    session[:session_token_uuid] = nil
    redirect_to("/")
  end

  private

  def render_navbar
    render(status: :accepted, template: "layouts/_navbar", layout: false)
  end

  def render_modal
    render(template: "shared/_login_modal", layout: false)
  end
end
