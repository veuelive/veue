# frozen_string_literal: true

require "system_helper"

describe "Modal login flow" do
  include AuthenticationTestHelpers::SystemTestHelpers

  let(:user) { create(:user) }

  def verify_button_disabled?
    page.has_button?("Verify", disabled: true)
  end

  def fill_secret_code(string: "1234")
    expect(page).to have_selector("input[name='secret_code']")
    fill_in("secret_code", with: string)
  end

  before :example do
    driven_by :media_browser
    resize_window_desktop
  end

  before :each do
    visit("/")
    find("body").click
    enter_phone_number(user)
  end

  context "Should appropriately toggle the Verify button" do
    context "Should make the Verify button enabled" do
      it "should allow a user to login" do
        fill_secret_code(string: "1234")
        expect(verify_button_disabled?).to eq(false)
      end

      it "should disable button after form submitted" do
        expect(page).to have_css("input[name='secret_code']")

        secret_code = user.session_tokens.where(
          state: %w[new pending_confirmation],
        ).last.secret_code

        fill_secret_code(string: secret_code)
        expect(verify_button_disabled?).to eq(false)

        verify_button = find_button("Verify")
        verify_button.click

        # Verify button will be disabled during request for
        # code verification.
        expect(verify_button).to be_disabled

        # Checking if user logged in after code verification request.
        expect_logged_in_as(user)
      end
    end

    context "Should leave the Verify button disabled" do
      it "if all are blank" do
        expect(verify_button_disabled?).to eq(true)
      end

      it "if less than 4 numbers" do
        fill_secret_code(string: "123")

        expect(verify_button_disabled?).to eq(true)
      end

      it "if not all 4 are numbers" do
        string = "1a23"
        fill_secret_code(string: string)
        expect(verify_button_disabled?).to eq(true)
      end
    end
  end
end
