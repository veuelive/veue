# frozen_string_literal: true

module ChannelConcern
  extend ActiveSupport::Concern

  included do
    def current_channel
      @current_channel ||= Channel.friendly.find(params[:channel_id])
    end
    helper_method :current_channel

    def current_video
      @current_video ||= current_channel.active_video&.decorate
    end
    helper_method :current_video
  end
end
