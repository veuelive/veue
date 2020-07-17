require 'nanoid'

class Stream < ApplicationRecord
  before_create :generate_slug
  before_create :register_live_stream!
  belongs_to :user
  has_many :mux_webhooks

  def register_live_stream!
    stream = MUX_SERVICE.create_live_stream
    data = stream.data
    puts stream.data.inspect
    self.stream_key = data.stream_key
    self.mux_live_stream_id = data.id
    self.mux_asset_id = data.active_asset_id
    self.mux_playback_id = data.playback_ids.first.id
    self
  end

  def to_param
    self.slug
  end

  private

  def generate_slug
    begin
      self.slug = Nanoid.generate
    end while Stream.where(id: slug).exists?
  end
end