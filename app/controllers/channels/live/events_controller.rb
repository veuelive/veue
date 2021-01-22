# frozen_string_literal: true

# For LIVE broadcasts only
module Channels
  module Live
    class EventsController < ApplicationController
      include ChannelConcern

      def index
        render(json: current_video&.recent_events_for_live&.map(&:to_hash))
      end
    end
  end
end
