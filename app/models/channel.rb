# frozen_string_literal: true

class Channel < ApplicationRecord
  include ChannelScheduleConcern
  extend FriendlyId

  before_save :normalize_name

  has_many :videos, dependent: :destroy
  has_many :follows,
           -> { where(unfollowed_at: nil) },
           inverse_of: :channel,
           dependent: :destroy
  has_many :followers,
           through: :follows,
           source: :user
  has_many :mux_webhooks, dependent: :destroy
  has_many :hosts, dependent: :destroy
  has_many :users, through: :hosts, dependent: :destroy

  has_one_attached :channel_icon, dependent: :destroy
  validates :channel_icon,
            blob: {
              content_type: %w[image/png image/jpg image/jpeg],
              size_range: 1..5.megabytes,
            }

  validates :name,
            uniqueness: true,
            allow_blank: false,
            length: {minimum: 2, maximum: 20}

  friendly_id :slug_candidates, use: [:slugged, :finders]
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

  # So we changed users and channel tables to many-to-may using
  # hosts table but for existing legacy implementation based on
  # belongs_to we have this function until we changed it at all
  # places.
  def user
    Rails.logger.warn(
      "This method is deprecated due to changes in channels and users relation from on-to-many to many-to-many",
    )
    users.first
  end
end
