# frozen_string_literal: true

module AuthenticationTestHelpers
  module RequestHelpers
    def login_as(user=nil)
      phone_number = user ? user.phone_number : PhoneTestHelpers.generate_valid
      session_token = SessionToken.create!(phone_number: phone_number)
      expect(session_token).to be_valid
      session_token.correct_code!
      post override_authentication_path(session_token_uuid: session_token.uuid)
    end
  end

  module SystemTestHelpers
    def login_as(user)
      open_nav_sidebar
      enter_phone_number(user)
      confirm_secret_code
      expect(page).to have_css("[data-user-id='#{user.id}']")
    end

    def logout_user
      find(".user-auth-area").hover
      click_on("Sign Out")
    end

    def enter_phone_number(user)
      click_button("Login")
      find("#phone_number_input").fill_in(with: user.phone_number)
      click_button("Continue")
    end

    def open_nav_sidebar
      return unless has_css?("#open-menu")

      click_button("open-menu")
    end

    private

    def confirm_secret_code
      4.times do |index|
        expect(page).to have_selector("input[name='secret_code_#{index}']")
        fill_in("secret_code_#{index}", with: SessionToken.last.secret_code[index])
      end

      expect(page).to have_button("Verify", disabled: false)
      click_button("Verify")
    end
  end
end
