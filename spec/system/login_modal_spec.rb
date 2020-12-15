# frozen_string_literal: true

require "system_helper"

describe "Modal login flow" do
  include AuthenticationTestHelpers::SystemTestHelpers

  let(:user) { create(:user) }

  def verify_button_disabled?
    page.has_button?("Verify", disabled: true)
  end

  def fill_secret_code(string: "1234", num: 4)
    num.times do |index|
      expect(page).to have_selector("input[name='secret_code_#{index}']")
      fill_in("secret_code_#{index}", with: string[index])
    end
  end

  before :example do
    driven_by :media_browser
    resize_window_desktop
  end

  before :each do
    visit("/")
    find("body").click
    open_nav_sidebar
    enter_phone_number(user)
  end

  context "Should appropriately toggle the Verify button" do
    context "Should make the Verify button enabled" do
      it "should allow a user to login" do
        fill_secret_code(string: "1234")
        expect(verify_button_disabled?).to eq(false)
      end
    end
    context "Should leave the Verify button disabled" do
      it "if all are blank" do
        expect(verify_button_disabled?).to eq(true)
      end

      it "if less than 4 numbers" do
        fill_secret_code(num: 3)

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
