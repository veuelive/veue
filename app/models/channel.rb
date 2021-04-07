# frozen_string_literal: true

class Channel < ApplicationRecord
  extend FriendlyId

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
  has_many :mux_webhooks, dependent: :destroy

  validates :name,
            uniqueness: true,
            allow_blank: false,
            length: {minimum: 2, maximum: 20}

  friendly_id :slug_candidates, use: :slugged
  encrypts :mux_stream_key
  delegate :profile_image, to: :user

  scope :most_popular, -> { order(followers_count: :desc) }

  def active_video
    videos.active.first
  end

  def broadcastable_video
    videos.find_by(state: %w[pending scheduled])
  end

  def active_video!
    return broadcastable_video if broadcastable_video

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
end
