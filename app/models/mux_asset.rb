# frozen_string_literal: true

class MuxAsset < ApplicationRecord
  belongs_to :video
  has_many :mux_webhooks, as: :webhook_target, dependent: :nullify
end
