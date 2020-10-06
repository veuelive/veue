# frozen_string_literal: true

class Follow < ApplicationRecord
  belongs_to :user_follow, foreign_key: :streamer_id, class_name: :User, inverse_of: :user_follows
  belongs_to :streamer_follow, foreign_key: :follower_id, class_name: :User, inverse_of: :streamer_follows

  def unfollow!
    update!(unfollowed_at: Time.current)
  end
end
