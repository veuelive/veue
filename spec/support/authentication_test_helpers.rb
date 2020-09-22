# frozen_string_literal: true

module AuthenticationTestHelpers
  module RequestHelpers
    def login_as(user=nil)
      phone_number = user ? user.phone_number : PhoneTestHelpers.generate_valid
      session_token = SessionToken.create!(phone_number: phone_number)
      expect(session_token).to be_valid
      session_token.sent_code!
      session_token.correct_code!
      post override_authentication_path(session_token_uuid: session_token.uuid)
    end
  end

  module SystemTestHelpers
    def login_as(user, mobile: false)
      load_page(mobile)
      enter_phone_number(user)
      confirm_secret_code
      open_nav_sidebar if mobile
      expect(page).to have_selector(".status-user__text")
    end

    private

    def load_page(mobile)
      visit("/")
      open_nav_sidebar if mobile
    end

    def open_nav_sidebar
      click_button("open-menu")
    end

    def enter_phone_number(user)
      click_button("Login")
      fill_in("phone_number_input", with: user.phone_number)
      click_button("Send Text")
    end

    def confirm_secret_code
      expect(page).to have_selector('input[name="secret_code"]')
      fill_in("secret_code", with: SessionToken.last.secret_code)
      click_button("Enter Code")
    end
  end
end
