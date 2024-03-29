# frozen_string_literal: true

module ChatHelper
  def current_user_id
    user_signed_in? ? current_user.to_param : ""
  end
end
