class AddUniqueIndexToFollows < ActiveRecord::Migration[6.0]
  def change
    remove_duplicates
    add_index :follows, [:user_id, :channel_id, :unfollowed_at], unique: true
  end

  def remove_duplicates
    Follow.all.group_by { |model| [model.user_id, model.channel_id] }.values.each do |duplicate|
        duplicate.shift
        duplicate.each(&:destroy)
      end
  end
end
