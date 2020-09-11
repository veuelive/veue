# frozen_string_literal: true

class BroadcastsController < ApplicationController
  before_action :authenticate_user!

  def show
    render(layout: "broadcast")
  end

  def blank
    render(layout: false)
  end
end
