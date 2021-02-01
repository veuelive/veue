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
    @user = User.find(params[:id]).decorate
    return unless current_user == @user

    if @user.update(permitted_parameters)
      render(status: :accepted, template: "users/partials/_edit_form", layout: false)
    else
      render(status: :bad_request, json: "")
    end
  end

  def upload_image
    @user = User.find(params[:id])
    return unless current_user == @user

    if @user.update(params.permit(:profile_image))
      render(partial: "users/partials/profile_image", locals: {user: @user})
    else
      render(status: :bad_request, json: "")
    end
  end

  def destroy_image
    @user = User.find(params[:id])
    return unless current_user == @user

    @user.profile_image.purge
    render(partial: "users/partials/profile_image", locals: {user: @user})
  end

  def destroy
    @user = User.find(params[:id])
    redirect_to(:back) && return unless @user.destroy

    session[:session_token_uuid] = nil
    redirect_to("/")
  end

  private

  def permitted_parameters
    params.require(:user).permit(:about_me, :display_name, :email)
  end
end
