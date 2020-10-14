class AddVideoViewsCounterToVideos < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :video_views_count, :integer
  end
end
