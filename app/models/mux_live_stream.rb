# frozen_string_literal: true

class MuxLiveStream < ApplicationRecord
  belongs_to :user
  has_many :mux_webhooks, as: :webhook_target, dependent: :restrict_with_exception
  has_many :videos, dependent: :nullify

  has_one :video, dependent: :nullify

  before_create :setup_with_mux
  before_destroy :remove_from_mux

  def setup_with_mux
    live_stream_response = MUX_SERVICE.create_live_stream
    data = live_stream_response.data
    self.mux_id = data.id
    self.mux_status = data.status
    self.stream_key = data.stream_key
    self.playback_id = data.playback_ids&.first&.id
  end

  # It's possible that we don't have a live Video object for this
  # MuxLiveStream when we have some kind of video event start
  # This will get called when we _need_ a Video model to exist
  def ensure_video_exists!
    if video&.live?
      return video if video
    end

    create_video(user_id: user_id)
  end

  # When we get destroyed, we should call Mux and let them know we're gone
  def remove_from_mux
    MUX_SERVICE.destroy_live_stream(mux_id)
  end
end
