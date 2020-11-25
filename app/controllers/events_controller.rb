# frozen_string_literal: true

class EventsController < ApplicationController
  def index
    render(json: [
             {
               start: 0,
               url: video_event_url(id: 0),
             },
           ])
  end

  def recent
    video = Video.find(params[:video_id])
    render(json: video.recent_events_for_live.map(&:to_hash))
  end

  def show
    video = Video.find(params[:video_id])
    events = video.video_events.order("timecode_ms")
    render(json: events.map(&:to_hash))
  end
end
