# frozen_string_literal: true

class AuthenticationsController < ApplicationController
  def create
    session[:ula_uuid] = nil
    @ula = UserLoginAttempt.new(phone_number: params[:phone_number])
    @ula.state = "pending_confirmation" if @ula.save
    render_modal
  end

  def update
    ula = UserLoginAttempt.find_by(ula_uuid: params[:ula_uuid])
    render_modal and return unless ula&.process_secret_code!(params[:secret_code])

    session[:ula_uuid] = ula.ula_uuid
    render_modal and return if ula.user.nil?

    render_navbar
  end

  # This is used for when we've forgotten who we are, but we want ot use
  # a previously created UserLoginAttempt
  def override
    return unless params[:ula_uuid]

    attempt = UserLoginAttempt.active.where(ula_uuid: params[:ula_uuid]).first
    session[:ula_uuid] = attempt.ula_uuid
  end

  def destroy
    session[:ula_uuid] = nil
    redirect_to("/")
  end

  private

  def render_navbar
    render(status: :accepted, template: "layouts/_navbar", layout: false)
  end

  def render_modal
    render(template: "layouts/nav/_login_modal", layout: false)
  end
end
