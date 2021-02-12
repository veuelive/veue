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

    can(:manage, :all)
    # The first argument to `can` is the action you are giving the user
    # permission to do.
    # If you pass :manage it will apply to every action. Other common actions
    # here are :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on.
    # If you pass :all it will apply to every resource. Otherwise pass a Ruby
    # class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the
    # objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details:
    # https://github.com/CanCanCommunity/cancancan/wiki/Defining-Abilities
  end
end
