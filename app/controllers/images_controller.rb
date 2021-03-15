# frozen_string_literal: true

class UserImagesController < ApplicationController
  def show
    user = User.find(params[:user_id])

    return redirect_to(placeholder_image_path) unless user.profile_image.attached?
    return redirect_to(url_for(user.profile_image.variant(resize_to_fill: [128, 128]))) if params[:id] == "thumbnail"

    redirect_to(url_for(user.profile_image))
  end

  private

  def placeholder_image_path
    helpers.asset_pack_path("media/images/logo-circular.svg")
  end
end
