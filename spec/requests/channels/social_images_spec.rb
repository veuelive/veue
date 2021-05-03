require 'rails_helper'

RSpec.describe "Channels::SocialImages", type: :request do
  describe "GET /index" do
    it "returns http success" do
      # get "/channels/social_image"
      expect(response).to have_http_status(:success)
    end
  end
end
