# frozen_string_literal: true

Rails.application.routes.draw do
  resources :videos, only: %i[index show new] do
    collection do
      get "broadcast"
    end

    resources :chat_messages, only: %i[create index]
  end

  resource :broadcast do
    member do
      get "blank"
    end
  end

  post "/mux/webhook", to: "mux_webhooks#index"

  resource :authentication do
    member do
      post :override
    end
  end

  resources :users

  post "/mux/webhook", to: "mux_webhooks#index"

  ActiveAdmin.routes(self)

  root "videos#index"
end
