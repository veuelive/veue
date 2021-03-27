# frozen_string_literal: true

module ChannelConcern
  extend ActiveSupport::Concern

  included do
    before_action :downcase_channel_id

    def current_channel
      @current_channel ||= Channel.friendly.find(params[:channel_id])&.decorate
    end
    helper_method :current_channel

    def current_video
      @current_video ||= current_channel.active_video&.decorate
    end
    helper_method :current_video

    def downcase_channel_id
      params[:channel_id] = params[:channel_id].downcase if params[:channel_id].present?
    end
  end
end
