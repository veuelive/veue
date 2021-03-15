# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Images", type: :request do
  describe "get user profile image" do
    let(:user) { create(:user_with_profile) }

    it "should fetch user's profile image" do
      get user_image_path(user, "thumbnail.png")
      expect(response).to have_http_status(302)
    end
  end
end
