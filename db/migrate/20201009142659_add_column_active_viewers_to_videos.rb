class AddColumnActiveViewersToVideos < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :active_viewers, :integer, default: 0
  end
end
