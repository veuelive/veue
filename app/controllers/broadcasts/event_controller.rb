# frozen_string_literal: true

module Broadcasts
  class EventController < ApplicationController
    before_action :ensure_valid_video_target!

    def layout
      @video.video_layout_events.create!(
        input: {
          width: params["width"],
          height: params["height"],
          sections: params["sections"],
        },
        user: current_user,
        timecode_ms: params["timecodeMs"],
      )
      render(json: {success: true})
    end

    private

    def fail!(error)
      render(json: {success: false, error_messages: [error]})
    end

    def ensure_valid_video_target!
      @video = Video.find(params[:broadcast_id])
      return fail!("No such video stream ID") unless @video
      return fail!("Does not belong to you") unless @video.channel.user == current_user
      return fail!("Video not live!") unless @video.live?

      true
    end
  end
end
