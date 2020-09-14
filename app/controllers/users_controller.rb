# frozen_string_literal: true

class UsersController < ApplicationController
  def create
    return unless current_ula
    return unless current_ula.user.nil?

    @current_user = current_ula.create_user(params[:display_name])

    if @current_user&.valid?
      render(status: :accepted, template: "layouts/_navbar", layout: false)
    else
      render(status: :bad_request, text: "")
    end
  end
end
