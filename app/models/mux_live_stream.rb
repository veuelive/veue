# frozen_string_literal: true

class MuxLiveStream < ApplicationRecord
  belongs_to :user
  has_many :mux_webhooks, as: :mux_target, dependent: :restrict_with_exception
  has_many :videos, dependent: :nullify

  before_create :setup_with_mux
  before_destroy :remove_from_mux

  def setup_with_mux
    return if mux_id

    live_stream_response = MUX_SERVICE.create_live_stream
    data = live_stream_response.data
    self.mux_id = data.id
    self.mux_status = data.status
    self.stream_key = data.stream_key
    self.mux_playback_id = data.playback_ids&.first&.id
  end

  # When we get destroyed, we should call Mux and let them know we're gone
  def remove_from_mux
    MUX_SERVICE.destroy_live_stream(mux_id)
  end
end
