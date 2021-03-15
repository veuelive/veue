# frozen_string_literal: true

class ImagesController < ApplicationController
  def show
    user = User.find(params[:user_id])

    return unless user.profile_image.attached?
    return redirect_to(user.profile_image.variant(resize_to_fill: [128, 128])&.url) if params[:id] == "thumbnail"

    redirect_to(user.profile_image&.url)
  end
end
