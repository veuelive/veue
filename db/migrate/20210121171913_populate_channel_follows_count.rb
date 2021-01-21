class PopulateChannelFollowsCount < ActiveRecord::Migration[6.0]
  def up
    # Updates all counter caches for follows create prior to this migration
    Channel.find_each do |channel|
      Channel.reset_counters(channel.id, :follows)
    end
  end
end
