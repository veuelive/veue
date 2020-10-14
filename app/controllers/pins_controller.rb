class PinsController < ApplicationController
  include VideoNestedConcern

  def create
    Pin.process_create(current_video, params[:timecode_ms], params[:url], params[:name], params[:thumbnail])
  end
end
