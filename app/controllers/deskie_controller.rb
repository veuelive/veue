# frozen_string_literal: true

# This controller is used as an API between Deskie and the main website
class DeskieController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :null_session

  def user_data
    render(json: {stream_key: current_user.mux_live_stream.stream_key})
  end

end
