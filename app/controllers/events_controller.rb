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
    navigations = video.browser_navigations.last(5)
    chat_messages = video.chat_messages.order("timecode_ms DESC").limit(50).to_a
    events = (navigations + chat_messages).sort_by(&:timecode_ms).map(&:to_json)
    render(json: events)
  end

  def show
    video = Video.find(params[:video_id])
    events = video.video_events.order("timecode_ms").map(&:to_json)
    render(json: events)
  end
end
