class AddDefaultTitleToVideos < ActiveRecord::Migration[6.0]
  def change
    change_column_default :videos, :title, from: nil, to: "Untitled Broadcast"
    update_null_video_titles
  end

  def update_null_video_titles
    Video.where(title: nil).update(title: "Untitled Broadcast")
  end
end
