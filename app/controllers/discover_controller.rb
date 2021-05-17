# frozen_string_literal: true

class DiscoverController < ApplicationController
  SUPPORTED_LOCALES = %w[en es].freeze
  public_constant :SUPPORTED_LOCALES

  # GET /discover or / or /en/:page_slug
  def index
    # BE CAREFUL only to use `public_videos` when building these queries!

    fields = cms_data&.data&.fields
    @seo_title = fields&.seo_title || "Discovery Veue"
    @cms_components = fields&.components

    set_default_variables && return if @cms_components.blank?

    @cms_components = map_components(@cms_components)
  end

  def cms_data
    @cms_data ||= fetch_cms_data
  end

  private

  def map_components(components)
    components.map do |component|
      case component.type
      when "hero_image"
        DiscoverHero.new(component)
      when "content"
        DiscoverContent.new(component)
      else
        DiscoverCuration.new(component)
      end
    end
  end

  def fetch_cms_data
    page_slug = "homepage-en"
    page_slug = ERB::Util.html_escape(params[:page_slug]) if params[:page_slug]
    # locale = ERB::Util.html_escape(params[:locale])

    Rails.cache.fetch("butter-cms-#{page_slug}", expires_in: 10.minutes) do
      ButterCMS::Page.get(
        "*",
        page_slug.to_s,
        {
          preview: params[:preview],
        },
      )
    end
  rescue ButterCMS::NotFound
  end

  def set_default_variables
    public_videos = Video.visibility_public.most_recent
    @live_videos = public_videos.live.limit(3).decorate
    @recent_videos = public_videos.finished.decorate
    @popular_channels = Channel.most_popular.limit(8).decorate
    @upcoming_videos = public_videos.scheduled.order("scheduled_at asc").limit(12).decorate
  end
end
