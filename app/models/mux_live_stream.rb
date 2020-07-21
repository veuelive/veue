# frozen_string_literal: true

class MuxLiveStream < ApplicationRecord
  belongs_to :user
  has_many :mux_webhooks, as: :webhook_target, dependent: :restrict_with_exception
  has_many :videos, dependent: :nullify

  before_create :setup_with_mux

  def setup_with_mux
    live_stream_response = MUX_SERVICE.create_live_stream
    data = live_stream_response.data
    self.mux_id = data.id
    self.mux_status = data.status
    self.stream_key = data.stream_key
    self.playback_id = data.playback_ids&.first&.id
  end
end
