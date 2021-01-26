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

  describe "UPDATE /:id" do
    let(:user) { create(:user) }
    before do
      login_as user
    end

    it "should update user" do
      new_name = "Donatello Pepperoni"
      put "/users/#{user.id}", params: {user: {display_name: new_name}}

      user.reload
      expect(user.display_name).to eq(new_name)
    end

    it "should update user with proper email" do
      email = "donatello@pepperoni.com"
      put "/users/#{user.id}", params: {user: {email: email}}

      expect(response).to have_http_status(:success)
    end

    it "should not update user with incorrect email" do
      email = "donatello@pepperoni"
      put "/users/#{user.id}", params: {user: {email: email}}

      expect(response).to have_http_status(:bad_request)
    end
  end
end
