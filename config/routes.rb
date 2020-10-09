# frozen_string_literal: true

Rails.application.routes.draw do
  resources :videos, only: %i[index show new] do
    collection do
      get "broadcast"
    end

    resources :events, only: %i[show index] do
      collection do
        get "recent"
      end
    end

    resources :chat_messages, only: %i[create index]
    resource :follow, only: %i[show create destroy]
  end

  resources :broadcasts, only: [:show, :index] do
    member do
      post "navigation_update"
      post "start"
    end

    collection do
      get "blank"
    end
  end

  post "/mux/webhook", to: "mux_webhooks#index"

  resource :authentication do
    member do
      post :override
    end
  end

  unless Rails.env.production?
    post "ipc_mock", to: "application#ipc_mock"
  end

  resources :users

  post "/mux/webhook", to: "mux_webhooks#index"

  ActiveAdmin.routes(self)

  root "videos#index"
end
