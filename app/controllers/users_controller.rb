# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!, only: %i[edit destroy]

  # Automatically generates @user
  load_resource except: %i[create]

  def edit
    authorize!(:manage, @user)
    @user = @user.decorate
  end

  def create
    return unless current_session_token
    return if current_session_token.user

    @current_user = User.new(
      session_tokens: [current_session_token],
      display_name: params[:display_name],
      phone_number: current_session_token.phone_number,
    )

    if @current_user.save
      render(status: :accepted, template: "layouts/_header", layout: false)
    else
      render(status: :bad_request, template: "shared/_login_modal", layout: false)
    end
  end

  def update
    authorize!(:manage, @user)
    @user = @user.decorate

    if @user.update(permitted_parameters)
      render(status: :accepted, template: "users/partials/_edit_form", layout: false)
    else
      render(status: :bad_request, template: "users/partials/_edit_form", layout: false)
    end
  end

  def upload_image
    authorize!(:manage, @user)
    @user = @user.decorate

    if @user.update(params.permit(:profile_image))
      render(partial: "users/partials/profile_image", locals: {user: @user})
    else
      render(status: :bad_request, json: "")
    end
  end

  def destroy_image
    authorize!(:manage, @user)

    @user = @user.decorate

    @user.profile_image.purge
    render(partial: "users/partials/profile_image", locals: {user: @user})
  end

  def destroy
    authorize!(:manage, @user)
    redirect_to(:back) && return unless @user.destroy

    session[:session_token_uuid] = nil
    redirect_to("/")
  end

  private

  def permitted_parameters
    params.require(:user).permit(:about_me, :display_name, :email)
  end
end
