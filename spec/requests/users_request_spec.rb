# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Users", type: :request do
  describe "POST /" do
    it "can create user" do
      # This is when we are technically logged in, but NOT a user yet!
      login_as nil

      name = "Michelangelo O'Pizzahan"
      post "/users", params: {display_name: name}
      expect(response).to have_http_status(:success)
      user = User.last
      expect(user.display_name).to eq(name)
      ula = SessionToken.last
      expect(user.phone_number).to eq(ula.phone_number)
      expect(ula.user_id).to eq(user.id)
    end

    it "should ignore create requests for existing users" do
      user = create(:user)
      login_as user

      count = User.count
      new_name = "Donatello Pepperoni"
      post "/users", params: {display_name: new_name}
      expect(User.count).to eq(count)
      user.reload
      expect(user.display_name).to_not eq(new_name)
    end
  end
end
