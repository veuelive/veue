# frozen_string_literal: true

require "rails_helper"

describe Users::RegistrationsController, type: :controller do
  let(:user) { create(:user) }
  before(:each) do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    @request.host = "test.localhost"
  end

  describe "GET new" do
    it "should render html view" do
      get :new

      expect(response).to render_template("registrations/new")
    end

    it "should render form partial" do
      get :new, format: :js

      expect(response).to render_template("registrations/_form")
    end
  end

  describe "POST create" do
    let(:user_params) {
      {
        user: {
          username: Faker::Internet.unique.username,
          email: Faker::Internet.unique.email,
          password: "mohawk",
          password_confirmation: "mohawk",
        },
      }
    }

    let(:invalid_user_params) {
      {
        user: {
          username: Faker::Internet.unique.username,
          email: Faker::Internet.unique.email,
          password: "",
          password_confirmation: "",
        },
      }
    }

    it "should create user and redirect to root" do
      post :create, params: user_params

      expect(User.exists?(email: user_params[:user][:email])).to eq(true)
      expect(response).to redirect_to(root_path)
    end

    it "should create user and render user_area partial" do
      post :create, params: user_params, format: :js

      expect(User.exists?(email: user_params[:user][:email])).to eq(true)
      expect(response).to render_template("layouts/nav/_user_area")
    end

    it "should not create user and render errors partial" do
      post :create, params: invalid_user_params, format: :js

      expect(User.exists?(email: user_params[:user][:email])).to eq(false)
      expect(response).to render_template("shared/_errors")
    end
  end
end
