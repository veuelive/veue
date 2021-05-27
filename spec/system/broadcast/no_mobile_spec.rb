# frozen_string_literal: true

require "system_helper"

describe "No Mobile Broadcasting" do

  # Unfortunately, after a long battle trying to set a UserAgent... I give up.
  it "should show you to the share page" do
    visit "/broadcasts/no_mobile"
    expect(page).to have_content("Share")
    expect(page).to have_content("desktop")
    expect(page).to have_content("Chrome")
  end
end
