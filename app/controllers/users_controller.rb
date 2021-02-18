# frozen_string_literal: true

class UsersController < ApplicationController
  include ModerateConcern

  before_action :authenticate_user!, only: %i[edit destroy]

  # Automatically generates @user
  load_and_authorize_resource except: %i[create]

  def edit
    @user = @user.decorate
  end

  def create
    return unless current_session_token
    return if current_session_token.user

    display_name = params[:display_name]

    @current_user = build_current_user(display_name)
    moderation_item = create_moderation_item(text: display_name)

    if moderation_item.approved? && @current_user.save
      moderation_item.update!(user: @current_user)
      render(status: :accepted, template: "layouts/_header", layout: false)
    else
      render(status: :bad_request, template: "shared/_login_modal", layout: false)
    end
  end

  def update
    @user = @user.decorate

    moderation_item = create_moderation_item(text: permitted_parameters[:display_name], user: @user)

    if moderation_item.approved? && @user.update(permitted_parameters)
      render(status: :accepted, template: "users/partials/_edit_form", layout: false)
    else
      render(status: :bad_request, template: "users/partials/_edit_form", layout: false)
    end

    moderation_item.save!
  end

  def upload_image
    @user = @user.decorate

    if @user.update(params.permit(:profile_image))
      render(partial: "users/partials/profile_image", locals: {user: @user})
    else
      render(status: :bad_request, json: "")
    end
  end

  def destroy_image
    @user = @user.decorate

    @user.profile_image.purge
    render(partial: "users/partials/profile_image", locals: {user: @user})
  end

  def destroy
    redirect_to(:back) && return unless @user.destroy

    session[:session_token_uuid] = nil
    redirect_to("/")
  end

  private

  def permitted_parameters
    params.require(:user).permit(:about_me, :display_name, :email)
  end

  def build_current_user(display_name)
    User.new(
      session_tokens: [current_session_token],
      display_name: display_name,
      phone_number: current_session_token.phone_number,
    )
  end
end
