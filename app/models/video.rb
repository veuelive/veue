# frozen_string_literal: true

class Video < ApplicationRecord
  belongs_to :user

  belongs_to :mux_live_stream
  has_many :mux_assets, dependent: :destroy
end
