# frozen_string_literal: true

module Channels
  module Live
    class PinsController < ApplicationController
      include ChannelConcern

      def create
        Pin.process_create(current_video, params[:timecode_ms], params[:url], params[:name], params[:thumbnail])
      end
    end
  end
end
