# frozen_string_literal: true

class DiscoverController < ApplicationController
  # GET /discover or /
  def index
    # BE CAREFUL only to use this `public_videos` query builder!
    public_videos = Video.visibility_public.most_recent

    load_curations

    @live_videos = public_videos.live.limit(3).decorate
    @recent_videos = public_videos.finished.decorate
    @popular_channels = Channel.most_popular.limit(8).decorate
    @scheduled_shows = Channel.where("next_show_at IS NOT NULL").order(:next_show_at).limit(20).decorate
  end

  def load_curations
    cms_data = fetch_curations

    @curations =
      cms_data.data.fields.curations.map do |curation|
        map_curation_to_videos(curation)
      end
  rescue ButterCMS::NotFound
    Rails.logger.error("Couldn't load curations")
  end

  def fetch_curations
    ButterCMS::Page.get(
      "*",
      "homepage-en",
      {
        preview: params[:preview],
      },
    )
  end

  def map_curation_to_videos(curation)
    video_ids = curation.fields.videos.map(&:video_id)
    videos = Video.where(id: video_ids).visibility_public.decorate
    {
      name: curation.fields.curation_name,
      videos: videos,
    }
  end
end
