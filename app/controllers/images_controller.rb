# frozen_string_literal: true

class ImagesController < ApplicationController
  def show
    user = User.find(params[:user_id])

    return unless user.profile_image.attached?
    return redirect_to(url_for(user.profile_image.variant(resize_to_fill: [128, 128]))) if params[:id] == "thumbnail"

    redirect_to(url_for(user.profile_image))
  end
end
