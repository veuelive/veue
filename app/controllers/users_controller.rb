# frozen_string_literal: true

class UsersController < ApplicationController
  def create
    return unless current_session_token
    return unless current_session_token.user.nil?

    @current_user = current_session_token.create_user(params[:display_name])

    if @current_user&.valid?
      render(status: :accepted, template: "layouts/_header", layout: false)
    else
      render(status: :bad_request, text: "")
    end
  end
end
