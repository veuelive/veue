# frozen_string_literal: true

class CmsUpcomingMapper < CmsDataMapper
  def view_component
    DiscoverUpcoming::Component.new(title: title, shows: shows)
  end

  def limit
    @limit ||= (fields[:max_size] || 8)
  end

  def shows
    return map_channel_names_to_shows if fields[:type] == "static_upcoming"

    find_channels
  end

  def find_channels
    Channel.where.not(next_show_at: nil).order("next_show_at ASC").limit(limit).decorate
  end

  def map_channel_names_to_channels
    upcoming_slugs = fields[:upcoming_broadcasts].pluck(:slug)

    Channel.where(slug: upcoming_slugs).where.not(next_show_at: nil).decorate
  end
end
