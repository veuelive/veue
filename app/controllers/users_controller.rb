# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!, only: %i[edit destroy]

  def edit
    @user = User.find(params[:id]).decorate
  end

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

    if @user.update(permitted_parameters)
      render(json: :success)
    else
      render(status: :bad_request, json: "")
    end
  end

  def destroy
    @user = User.find(params[:id])

    redirect_to(:back) && return unless @user.destroy

    session[:session_token_uuid] = nil
    redirect_to("/")
  end

  private

  def permitted_parameters
    params.require(:user).permit(:profile_image, :about_me, :display_name, :email)
  end
end
