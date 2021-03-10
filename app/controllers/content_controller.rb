# frozen_string_literal: true

# This Controller is responsible for display and requesting content from our
# CMS. URLs to this page are like... https://veue.tv/en/legal-information
#
# At time of writing this uses ButterCMS, which if you need access to it please ask your
# manager or ask someone in marketing.
class ContentController < ApplicationController
  def show
    # This line is here to escape to make Brakeman happy that we aren't passing in HTML here.
    page_slug = ERB::Util.html_escape(params[:page_slug])

    # This fetches the html and content for the page
    @content = ButterCMS::Page.get("company_content", page_slug, {})

    head_info
  rescue ButterCMS::NotFound
    # Here, we bubble this up to the general 404 handler
    raise(ActiveRecord::RecordNotFound)
  end

  private

  def head_info
    fields = @content.fields

    # Be careful here as the API returns empty strings on the fields that aren't filled out
    # so we make extensive use of the helper method `presence`
    open_graph_headers(fields.open_graph) if fields.open_graph
    seo_headers(fields.seo) if fields.seo
    twitter_headers(fields.twitter_card) if fields.twitter_card
  end

  def open_graph_headers(data)
    @og_title = data.title.presence
    @og_description = data.description.presence
    @og_image = data.image.presence
  end

  def seo_headers(data)
    @seo_title = data.title.presence
    @seo_description = data.meta_description.presence
  end

  def twitter_headers(data)
    @twitter_title = data.title.presence
    @twitter_description = data.description.presence
    @twitter_image = data.image.presence
  end
end
