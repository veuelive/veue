# frozen_string_literal: true

class SettingsController < ApplicationController
  before_action :authenticate_user!

  def index
    @user = User.find(params[:user_id])
  end
end
