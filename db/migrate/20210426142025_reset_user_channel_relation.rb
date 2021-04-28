class ResetUserChannelRelation < ActiveRecord::Migration[6.1]
  def up
    Channel.where.not(user_id: nil).each do |channel|
      channel.users << User.find(channel.user_id)
    end

    rename_column :channels, :user_id, :legacy_user_id
  end

  def down
    rename_column :channels, :legacy_user_id, :user_id
  end
end
