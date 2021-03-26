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
    # this will redirect, this is on you to handle this.
    def login_as(user)
      session_token = SessionToken.find_or_create_by!(user_id: user.id)

      session_token.correct_code! unless session_token.active?

      original_url = page.current_url
      page.set_rack_session(session_token_uuid: session_token.uuid)
      visit(original_url)
    end

    def actual_login_as(user)
      open_nav_sidebar
      enter_phone_number(user)
      confirm_secret_code(user)
      expect_logged_in_as(user)
    end

    def logout_user
      original_url = page.current_url
      page.set_rack_session(session_token_uuid: nil)
      visit(original_url)
    end

    def actual_logout_user
      find(".menu-area").hover
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

    def confirm_secret_code(user)
      expect(page).to have_css("input[name='secret_code']")

      secret_code = user.session_tokens.where(
        state: %w[new pending_confirmation],
      ).last.secret_code

      fill_in("secret_code", with: secret_code)

      click_button("Verify", wait: 5)
    end

    def expect_logged_in_as(user)
      expect(page).to have_css("[data-user-id='#{user.id}']")
    end
  end
end
