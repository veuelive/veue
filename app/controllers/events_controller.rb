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
    navigations = video.browser_navigations.order("created_at DESC").limit(10).map(&:to_json)

    # Chat messages are all set to 0, so they can go first.
    events = (video.chat_messages_for_live + navigations + video.pin_events.map(&:to_json))
    render(json: events)
  end

  def show
    video = Video.find(params[:video_id])
    events = video.video_events.order("timecode_ms").map(&:to_json)
    render(json: events)
  end
end
