# frozen_string_literal: true

# CanCanCan's top level module for authorization
class Ability
  include CanCan::Ability

  def initialize(user)
    can(:read, [Channel, User])
    can(:read, Video, visibility: %w[public protected])

    return if user.blank?

    can(:manage, User, id: user.id)
    can(:manage, [Channel, Video], user_id: user.id)

    return unless user.admin?

    can(:manage, [User, Channel, Video])
    can(:read, ActiveAdmin::Page, name: "Dashboard", namespace_name: "admin")
  end
end
