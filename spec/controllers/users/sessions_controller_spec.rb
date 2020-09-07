# frozen_string_literal: true

require "rails_helper"

describe Users::SessionsController, type: :controller do
  let(:user) { create(:user) }
  before(:each) do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    @request.host = "test.localhost"
  end

  describe "GET new" do
    it "should render html view" do
      get :new

      expect(response).to render_template("sessions/new")
    end

    it "should render form partial" do
      get :new, format: :js

      expect(response).to render_template("sessions/_form")
    end
  end

  describe "POST create" do
    it "should create user and redirect to root" do
      post :create, params: {user: {email: user.email, password: user.password}}

      expect(controller.current_user.id).to eq(user.id)
      expect(response).to redirect_to(root_path)
    end

    it "should create user and render user_area partial" do
      post :create, params: {user: {email: user.email, password: user.password}}, format: :js

      expect(controller.current_user.id).to eq(user.id)
      expect(response).to render_template("layouts/nav/_user_area")
    end
  end

  describe "DELETE destroy" do
    it "should signout user and redirect to root" do
      delete :destroy

      expect(controller.current_user).to eq(nil)
      expect(response).to redirect_to(root_path)
    end
  end
end
