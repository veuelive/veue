class AddUniquenessIndexesForVideoViews < ActiveRecord::Migration[6.0]
  def change
    remove_duplicates
    add_index :video_views, [:video_id, :user_id], unique: true, where: "user_id IS NOT NULL"
    add_index :video_views, [:video_id, :details], unique: true, where: "user_id IS NULL"
  end

  def remove_duplicates
    remove_duplicate_details
    remove_duplicate_users
  end

  # Remove duplicate VideoView.details for nil users
  def remove_duplicate_details
    VideoView.where("user_id IS NULL")
      .group_by { |model| [model.video_id, model.details] }.values.each do |duplicate|
        duplicate.shift # Pull out first record
        duplicate.each(&:destroy) # Destroy all following records
      end
  end

  def remove_duplicate_users
    VideoView.where("user_id IS NOT NULL")
      .group_by { |model| [model.video_id, model.user_id] }.values.each do |duplicate|
        duplicate.shift
        duplicate.each(&:destroy)
      end
  end
end
