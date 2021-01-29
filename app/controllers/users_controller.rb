# frozen_string_literal: true

class UsersController < ApplicationController
  include CreateBlobFromParams

  before_action :authenticate_user!, only: %i[edit destroy]

  def edit
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
    return unless current_user == user

    if user.update(permitted_parameters)
      render(status: :accepted, template: "users/partials/_edit_form", layout: false)
    else
      render(status: :bad_request, json: "")
    end
  end

  def upload_image
    return unless current_user == user

    image = create_blob_from_params(params[:profile_image])

    if user.update(profile_image: image)
      render(status: :accepted, template: "users/partials/_upload_image", layout: false)
    else
      render(status: :bad_request, json: "")
    end
  end

  def destroy
    redirect_to(:back) && return unless user.destroy

    session[:session_token_uuid] = nil
    redirect_to("/")
  end

  private

  def user
    @user ||= User.find(params[:id]).decorate 
  end
  helper_method :user

  def permitted_parameters
    params.require(:user).permit(:about_me, :display_name, :email)
  end
end
