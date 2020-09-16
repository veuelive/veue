# frozen_string_literal: true

class BroadcastsController < ApplicationController
  before_action :authenticate_user!

  def show
    current_user.setup_as_streamer!
    render(layout: "broadcast")
  end

  def blank
    render(layout: false)
  end
end
