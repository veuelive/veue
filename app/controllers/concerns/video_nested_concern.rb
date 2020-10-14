# frozen_string_literal: true

module VideoNestedConcern
  extend ActiveSupport::Concern

  included do
    def current_video
      @current_video ||= Video.find(params[:video_id] || params[:broadcast_id])
    end
    helper_method :current_video
  end
end
