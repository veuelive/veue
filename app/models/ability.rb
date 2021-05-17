# frozen_string_literal: true

# CanCanCan's top level module for authorization
class Ability
  include CanCan::Ability
  prepend Draper::CanCanCan

  def initialize(user)
    can(:read, [Channel, User, VideoSnapshot])
    can(:read, Video, visibility: %w[public protected])

    return if user.blank?

    can(:manage, User, id: user.id)
    can(:manage, Channel, id: user.channel_ids)
    can(:manage, Video, id: user.video_ids)
    can(:manage, VideoSnapshot, id: user.video_snapshot_ids)

    return unless user.admin?

    can(:manage, [User, Channel, Video, VideoSnapshot])
    can(:read, ActiveAdmin::Page, name: "Dashboard", namespace_name: "admin")
  end
end
