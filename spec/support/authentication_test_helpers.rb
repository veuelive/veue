# frozen_string_literal: true

module AuthenticationTestHelpers
  def login_as(user)
    session_uuid = user.user_login_attempts.active.first.session_uuid
    post authentication_path(session_uuid: session_uuid)
  end
end
