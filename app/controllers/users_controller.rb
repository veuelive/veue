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

  def update
    @user = User.find(params[:id])
    return unless current_user == @user

    @user.update!(permitted_parameters)
    redirect_back(fallback_location: root_path)
  end

  private

  def permitted_parameters
    params.require(:user).permit(:profile_image, :about_me, :display_name)
  end
end
