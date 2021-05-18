# frozen_string_literal: true

module Components
  module Discover
    class Curation
      include DiscoverableComponent

      def limit
        Integer(@fields.max_size) if @fields.max_size
      end

      def title
        @fields.title
      end

      # Where to lookup the view for the Model
      def to_partial_path
        "discover/components/curation"
      end

      def collection
        return map_video_ids_to_videos(component) if component.type == "static_curation"

        queries.fetch(@fields&.type&.underscore&.to_sym, queries.fetch(:most_recent)).call.decorate
      end

      private

      # Everything is wrapped in a proc so we dont invoke them until we're ready
      def queries
        @queries ||= {
          trending_this_week: trending_this_week,
          trending_this_month: trending_this_month,
          popular_this_week: popular_this_week,
          popular_this_month: popular_this_month,
          popular_all_time: popular_all_time,
          live: live,
          most_recent: most_recent,
        }
      end

      def map_video_ids_to_videos(component)
        video_ids = component.fields.videos.map(&:video_id)
        Video.where(id: video_ids).visibility_public.decorate
      rescue ButterCMS::NotFound
        Rails.logger.error("Couldn't load static curations")
      end

      def public_videos
        Video.visibility_public
      end

      # Make these procs so they dont trigger when placed in a hash

      def most_recent
        proc { public_videos.finished.most_recent.limit(limit) }
      end

      def live
        proc { public_videos.live.limit(limit) }
      end

      def trending_this_week
        proc { public_videos.finished.trending_this_week.limit(limit) }
      end

      def trending_this_month
        proc { public_videos.finished.trending_this_month.limit(limit) }
      end

      def popular_this_week
        proc { public_videos.finished.popular_this_week.limit(limit) }
      end

      def popular_this_month
        proc { public_videos.finished.popular_this_month.limit(limit) }
      end

      def popular_all_time
        proc { public_videos.finished.popular_all_time.limit(limit) }
      end
    end
  end
end
