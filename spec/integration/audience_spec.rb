# frozen_string_literal: true

require "rails_helper"

describe "Videos" do
  let(:user) { create(:user) }
  let(:video) { create(:video) }

  describe "View videos/:id with user logged in" do

    it "should have chat form if user is logged in" do
      visit video_path(video)

      assign :current_user, user

      expect(page).to have_selector(".message-write")
    end
  end

  describe "Get videos/:id without being logged in" do
    it "should NOT have chat form if user is logged out" do
      visit video_path(video)

      expect(page).not_to(have_selector(".message-write"))
    end
  end
end
