# frozen_string_literal: true

class MuxAsset < ApplicationRecord
  belongs_to :video, optional: true
  has_many :mux_webhooks, as: :mux_target, dependent: :nullify
end
