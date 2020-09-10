# frozen_string_literal: true

Rails.application.routes.draw do
  resources :videos, only: %i[index show new] do
    collection do
      get "broadcast"
    end

    resources :chat_messages, only: [:create, :index]
  end

  resource :broadcast do
    member do
      get "blank"
    end
  end

  post "/mux/webhook", to: "mux_webhooks#index"

  devise_for :users, controllers: {sessions: "users/sessions", registrations: "users/registrations"}

  devise_for :admins, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  root "videos#index"
end
