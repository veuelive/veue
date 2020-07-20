class MuxAsset < ApplicationRecord
  belongs_to :user
  belongs_to :video
  has_many :mux_webhooks, as: :webhook_target
end
