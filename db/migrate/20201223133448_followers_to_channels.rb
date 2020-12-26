class FollowersToChannels < ActiveRecord::Migration[6.0]
  def change
    rename_column :follows, :follower_id, :user_id
    add_column :follows, :channel_id, :uuid
    add_index :follows, :channel_id

    Follow.all.each do |follow|
      channel = User.find(follow.streamer_id).channels.first
      follow.update!(channel_id: channel.id)
    end

    remove_column :follows, :streamer_id
  end
end
