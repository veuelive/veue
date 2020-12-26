# frozen_string_literal: true

module Channels
  module Live
    class ReactionsController < ApplicationController
      include ChannelConcern

      def create
        VideoReactionEvent.create!(
          video: current_video,
          user: current_user,
        )
      end
    end
  end
end
