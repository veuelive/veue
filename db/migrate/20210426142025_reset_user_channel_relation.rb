class ResetUserChannelRelation < ActiveRecord::Migration[6.1]
  def up
    Channel.where.not(user_id: nil).each do |channel|
      channel.users << User.find(channel.user_id)
    end

    remove_column :channels, :user_id
  end

  def down
    add_reference :channels, :user, type: :uuid

    Channel.all.each do |channel|
      channel.update(user_id: channel.users.first.id)
    end
  end
end
