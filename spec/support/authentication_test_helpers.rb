# frozen_string_literal: true

module AuthenticationTestHelpers
  module RequestHelpers
    def login_as(user=nil)
      phone_number = user ? user.phone_number : Faker::PhoneNumber.phone_number_with_country_code
      ula = UserLoginAttempt.create!(phone_number: phone_number)
      expect(ula).to be_valid
      ula.sent_code!
      ula.correct_code!
      post override_authentication_path(ula_uuid: ula.ula_uuid)
    end
  end

  module SystemTestHelpers
    def login_as(user)
      load_page
      enter_phone_number(user)
      confirm_secret_code
      expect(page).to have_selector(".status-user__text")
    end

    private

    def load_page
      visit("/")
    end

    def enter_phone_number(user)
      click_button("Login")
      fill_in("phone_number_input", with: user.phone_number)
      click_button("Send Text")
    end

    def confirm_secret_code
      expect(page).to have_selector('input[name="secret_code"]')
      fill_in("secret_code", with: UserLoginAttempt.last.secret_code)
      click_button("Enter Code")
    end
  end
end
