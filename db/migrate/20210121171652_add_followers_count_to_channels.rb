# frozen_string_literal: true

class AddFollowersCountToChannels < ActiveRecord::Migration[6.0]
  def change
    add_column(:channels, :followers_count, :integer, default: 0)
  end
end
