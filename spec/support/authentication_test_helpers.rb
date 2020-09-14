# frozen_string_literal: true

module AuthenticationTestHelpers
  module RequestHelpers
    def login_as(user)
      ula_uuid = user.user_login_attempts.active.first.ula_uuid
      post override_authentication_path(ula_uuid: ula_uuid)
    end
  end

  module IntegrationHelpers
    def login_as(user)
      visit "/"
      click_button "Login"
      fill_in "Phone Number", :with => "+1 904 384 1982"
    end
  end
end
