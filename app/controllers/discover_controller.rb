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
      when "hero_image", "responsive_hero"
        Components::Discover::Hero.new(component)
      when "content"
        Components::Discover::Content.new(component)
      when "static_curation", "dynamic_curation"
        Components::Discover::Curation.new(component)
      when "static_upcoming", "dynamic_upcoming"
        Components::Discover::Upcoming.new(component)
      end
    end
  end

  def fetch_cms_data
    options = load_options_and_preview
    page_slug = "homepage-en"
    page_slug = ERB::Util.html_escape(params[:page_slug]) if params[:page_slug]
    # locale = ERB::Util.html_escape(params[:locale])

    Rails.cache.fetch("butter-cms-#{page_slug}-#{options[:preview]}", expires_in: 10.minutes) do
      ButterCMS::Page.get(
        "*",
        page_slug.to_s,
        options,
      )
    end
  rescue ButterCMS::NotFound
    # If we don't find it, that's actually just fine... render the discover page as normal!
  end

  def public_videos
    @public_videos ||= Video.visibility_public.most_recent
  end

  def set_default_variables
    @live_videos = public_videos.live.limit(3).decorate
    @recent_videos = public_videos.finished.decorate
    @popular_channels = Channel.most_popular.limit(8).decorate
    @scheduled_shows = Channel.where.not(next_show_at: nil).order(:next_show_at).limit(20).decorate
  end

  def load_options_and_preview
    return {} unless params[:token] == "1982"

    # Need to set this policy for iframe previews to work
    response.headers["Content-Security-Policy"] = "frame-ancestors 'self' https://buttercms.com;"

    {preview: params[:preview]}
  end
end
