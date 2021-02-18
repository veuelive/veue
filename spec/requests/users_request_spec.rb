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
    let(:user) { create(:streamer) }
    before do
      login_as user
    end

    it "should update user and their channels" do
      new_name = "Donatello Pepperoni"
      put "/users/#{user.id}", params: {user: {display_name: new_name}}

      expect(user.reload.display_name).to eq(new_name)
      expect(user.channels.first.name).to eq(new_name)
    end

    it "should not update user with an improper display name but still create a moderation item" do
      new_name = "bad word"

      expect(ModerationItem.count).to eq(0)

      PerspectiveApi.key = "FAIL"

      put "/users/#{user.id}", params: {user: {display_name: new_name}}

      expect(user.display_name).not_to(eq(new_name))
      expect(ModerationItem.count).to eq(1)
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

    it "should update profile image" do
      image = fixture_file_upload("spec/factories/test.png", "image/png")

      put "/users/#{user.id}/upload_image", params: {profile_image: image}
      expect(response).to have_http_status(:success)

      user.reload
      expect(user.profile_image.attached?).to eq(true)
    end

    it "should not update user with inappropriate display name" do
      PerspectiveApi.key = "FAIL"
      display_name = "superbad"
      put "/users/#{user.id}/", params: {user: {display_name: display_name}}
      expect(response).to have_http_status(:bad_request)
      expect(user.reload.display_name).to_not eq(display_name)
      expect(user.channels.first.name).to_not eq(display_name)
    end
  end

  describe "delete /:id/destroy_image" do
    let(:user) { create(:user) }
    before do
      login_as user
    end

    it "should remove profile image" do
      # attach image with user to delete
      user.profile_image.attach(fixture_file_upload("spec/factories/test.png", "image/png"))
      expect(user.profile_image.attached?).to eq(true)

      delete "/users/#{user.id}/destroy_image"
      expect(response).to have_http_status(:success)

      user.reload
      expect(user.profile_image.attached?).to eq(false)
    end
  end
end
