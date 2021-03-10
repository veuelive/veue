# frozen_string_literal: true

module Channels
  module Vod
    class EventsController < ApplicationController
      include ChannelConcern

      def index
        render(
          json: [
            {
              start: 0,
              url: channel_video_vod_event_path(id: 0),
            },
          ],
        )
      end

      def show
        video = Video.find(params[:video_id])
        events = video.video_events.published.order("timecode_ms")
        render(json: events.map(&:to_hash))
      end
    end
  end
end
