# frozen_string_literal: true

# This module is really only to help create a bridge between the helpers
# that we use from Devise and Typechecking algorithms in IDE's.
#
# Without this file, all of these methods are unknown to static analysis
module DeviseHelperConcern
  extend ActiveSupport::Concern

  # @return [User]
  def current_user
    super
  end

  # @return [Boolean]
  def user_signed_in?
    super
  end

  # @return [Boolean]
  def authenticate_user!
    super
  end
end
