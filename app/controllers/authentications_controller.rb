# frozen_string_literal: true

class AuthenticationsController < ApplicationController
  include AuthenticationsHelper

  def create
    session[:session_token_uuid] = nil
    @ula = SessionToken.new(phone_number: params[:phone_number])
    @ula.save!
    @phone_number = mask_phone_number(params[:phone_number])
    # We temporarily set this state to render the next partial correctly
    @ula.state = "pending_confirmation"
    render_modal
  end

  def update
    ula = SessionToken.find_by(uuid: params[:session_token_uuid])

    secret_code = params[:secret_code]
    render_modal and return unless ula&.process_secret_code!(secret_code)

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
    render(status: :accepted, template: "layouts/_header", layout: false)
  end

  def render_modal
    render(template: "shared/_login_modal", layout: false)
  end
end
