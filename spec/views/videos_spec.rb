# frozen_string_literal: true

require "rails_helper"

describe "Videos", type: :system do
  let(:user) { create(:user) }
  let(:video) { create(:video) }

  describe "Get videos/:id with user logged in" do
    before do
      login_as(user)
    end

    it "should have chat form if user is logged in" do
      visit video_path(video)

      expect(page).to have_selector(".chat-form")
    end
  end

  describe "Get videos/:id without logged in" do
    it "should have chat form if user is logged in" do
      visit video_path(video)

      expect(page).not_to(have_selector(".chat-form"))
    end
  end
end
