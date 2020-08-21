# frozen_string_literal: true

Rails.application.routes.draw do
  resources :videos, only: %i[index show new] do
    collection do
      get "streamer"
    end
  end
  resources :chat_messages, only: [:create]
  post "/mux/webhook", to: "mux_webhooks#index"

  devise_for :users

  devise_for :admins, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  # API
  get "/deskie/user_data": "deskie#user_data", as: :deskie_user_data

  root "videos#index"
end
