# frozen_string_literal: true

class Follow < ApplicationRecord
  belongs_to :follower, foreign_key: :follower_user_id, class_name: :User
  belongs_to :streamer, foreign_key: :streamer_user_id, class_name: :User
end
