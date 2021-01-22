# frozen_string_literal: true

class Channel < ApplicationRecord
  extend FriendlyId
  before_create :register_with_mux
  before_save :normalize_name
  belongs_to :user
  has_many :videos, dependent: :destroy
  has_many :follows,
           -> { where(unfollowed_at: nil) },
           inverse_of: :channel,
           dependent: :destroy
  has_many :followers,
           through: :follows,
           source: :user
  validates :name,
            uniqueness: true,
            allow_blank: false,
            length: {minimum: 2, maximum: 20}
  friendly_id :slug_candidates, use: :slugged
  encrypts :mux_stream_key
  delegate :profile_image, to: :user

  has_many :mux_webhooks, dependent: :destroy

  def active_video
    videos.active.first
  end

  def active_video!
    # We need to treat both "live" and "starting" videos as active videos.
    # Only "pending"  videos should be broadcastable
    return active_video if active_video&.pending?

    active_video&.end!
    create_new_broadcast!
  end

  def create_new_broadcast!
    videos.create!(user: user)
  end

  def recent_broadcasts
    videos.finished.visibility_public.most_recent
  end

  def slug_candidates
    [
      :name,
      -> { "#{name}-live" },
      -> { "#{name}-channel" },
      -> { "#{name}-streaming" },
      -> { "watch-#{name}" },
      -> { "see-#{name}" },
      -> { "#{name}-on-air" },
    ]
  end

  def normalize_name
    name.unicode_normalize!
  end

  def about
    user.about_me
  end

  private

  def register_with_mux
    return if mux_live_stream_id

    live_stream_response = MUX_SERVICE.create_live_stream
    data = live_stream_response.data
    self.mux_live_stream_id = data.id
    self.mux_stream_key = data.stream_key
  end
end
