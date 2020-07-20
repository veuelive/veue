class Video < ApplicationRecord
  belongs_to :user

  belongs_to :mux_live_stream
  has_many :mux_assets
end
